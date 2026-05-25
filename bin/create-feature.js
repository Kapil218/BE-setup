#!/usr/bin/env node

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function normalize(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// no-op: do not create .gitkeep files anymore
async function createGitkeep(_dir) {
  void _dir;
  return;
}

async function main() {
  const nameArg = process.argv[2];

  if (!nameArg) {
    process.stderr.write("Usage: create-feature <name>\n");
    process.exit(1);
  }

  const name = normalize(nameArg);
  const base = path.resolve(process.cwd(), "src", "modules", name);
  const subdirs = [
    "controllers",
    "services",
    "repositories",
    "routes",
    "validators",
    "types",
    "constants",
  ];

  for (const sd of subdirs) {
    const dir = path.join(base, sd);
    await mkdir(dir, { recursive: true });
    await createGitkeep(dir);
  }

  // index.ts
  const indexPath = path.join(base, "index.ts");
  if (!(await exists(indexPath))) {
    const routeName = `${name}Routes`;
    const indexContent = `export { default as ${routeName} } from './routes/${name}Routes.js';\n`;
    await writeFile(indexPath, indexContent, "utf8");
  }

  // routes file
  // create typed boilerplate files for each subfolder
  const pascal = name.replace(/(^.|-.)/g, (s) =>
    s.replace("-", "").toUpperCase(),
  );

  // filenames in camelCase: feature + FolderType
  const fileMap = {
    controllers: `${name}Controller.ts`,
    services: `${name}Service.ts`,
    repositories: `${name}Repository.ts`,
    routes: `${name}Routes.ts`,
    validators: `${name}Validators.ts`,
    types: `${name}Types.ts`,
    constants: `${name}Constants.ts`,
  };

  // controllers
  const controllerPath = path.join(base, "controllers", fileMap.controllers);
  if (!(await exists(controllerPath))) {
    const content = `import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ${name}Service } from "../services/${name}Service.js";
import type { Create${pascal}Body, Update${pascal}Body, ${pascal}Params, List${pascal}Query } from "../types/${name}Types.js";

export const create${pascal} = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as Create${pascal}Body;
  const item = await ${name}Service.create${pascal}(payload);
  return res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, item, "Created"));
});

export const list${pascal} = asyncHandler(async (req: Request, res: Response) => {
  const query = (res.locals.validatedQuery ?? req.query) as List${pascal}Query;
  const result = await ${name}Service.list${pascal}(query);
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "OK"));
});

export const get${pascal}ById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as ${pascal}Params;
  const item = await ${name}Service.get${pascal}ById(id);
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, item, "OK"));
});

export const update${pascal} = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as ${pascal}Params;
  const payload = req.body as Update${pascal}Body;
  const item = await ${name}Service.update${pascal}(id, payload);
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, item, "Updated"));
});

export const delete${pascal} = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as ${pascal}Params;
  const item = await ${name}Service.delete${pascal}(id);
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, item, "Deleted"));
});
`;
    await writeFile(controllerPath, content, "utf8");
  }

  // service
  const servicePath = path.join(base, "services", fileMap.services);
  if (!(await exists(servicePath))) {
    const content = `import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";
import { createPaginationMeta } from "../../utils/pagination.js";
import { ${name}Repository } from "../repositories/${name}Repository.js";

export const ${name}Service = {
  async create${pascal}(payload: any) {
    // TODO: validate and type payload
    return ${name}Repository.create(payload);
  },

  async list${pascal}(query: any) {
    const where = query.search ? { OR: [] } : {};
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      ${name}Repository.findMany(where, skip, query.limit),
      ${name}Repository.count(where),
    ]);
    return { items, pagination: createPaginationMeta(query.page, query.limit, total) };
  },

  async get${pascal}ById(id: string) {
    const item = await ${name}Repository.findById(id);
    if (!item) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found");
    }
    return item;
  },

  async update${pascal}(id: string, payload: any) {
    return ${name}Repository.updateById(id, payload);
  },

  async delete${pascal}(id: string) {
    const item = await ${name}Repository.findById(id);
    if (!item) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Not found");
    }
    await ${name}Repository.deleteById(id);
    return item;
  },
};
`;
    await writeFile(servicePath, content, "utf8");
  }

  // repository
  const repoPath = path.join(base, "repositories", fileMap.repositories);
  if (!(await exists(repoPath))) {
    const content = `import { prisma } from "../../../config/db.config.js";

// TODO: replace 'model' with your Prisma model name in lowerCamelCase (e.g., user -> prisma.user)
export const ${name}Repository = {
  create(data: any) {
    return prisma.model.create({ data });
  },

  findById(id: string) {
    return prisma.model.findUnique({ where: { id } });
  },

  findMany(where: any, skip: number, take: number) {
    return prisma.model.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } });
  },

  count(where: any) {
    return prisma.model.count({ where });
  },

  updateById(id: string, data: any) {
    return prisma.model.update({ where: { id }, data });
  },

  deleteById(id: string) {
    return prisma.model.delete({ where: { id } });
  },
};
`;
    await writeFile(repoPath, content, "utf8");
  }

  // validators
  const validatorsPath = path.join(base, "validators", fileMap.validators);
  if (!(await exists(validatorsPath))) {
    const content = `import { z } from "zod";

export const ${name}ParamsSchema = z.object({ id: z.string().cuid() });

export const create${pascal}BodySchema = z.object({
  name: z.string().min(1).optional(),
});

export const update${pascal}BodySchema = create${pascal}BodySchema.partial().refine((v) => Object.keys(v).length > 0, { message: 'At least one field is required' });

export const list${pascal}QuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(10), search: z.string().trim().min(1).optional() });
`;
    await writeFile(validatorsPath, content, "utf8");
  }

  // routes (create a basic REST routes file wired to controllers and validators)
  const routesPath = path.join(base, "routes", fileMap.routes);
  if (!(await exists(routesPath))) {
    const routesContent = `import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware.js";
import {
  create${pascal},
  list${pascal},
  get${pascal}ById,
  update${pascal},
  delete${pascal},
} from "../controllers/${name}Controller.js";
import { create${pascal}BodySchema, list${pascal}QuerySchema, update${pascal}BodySchema, ${name}ParamsSchema } from "../validators/${name}Validators.js";

const router = Router();

router.get('/', validate({ query: list${pascal}QuerySchema }), list${pascal});
router.get('/:id', validate({ params: ${name}ParamsSchema }), get${pascal}ById);
router.post('/', validate({ body: create${pascal}BodySchema }), create${pascal});
router.patch('/:id', validate({ params: ${name}ParamsSchema, body: update${pascal}BodySchema }), update${pascal});
router.delete('/:id', validate({ params: ${name}ParamsSchema }), delete${pascal});

export default router;
`;
    await writeFile(routesPath, routesContent, "utf8");
  }

  // types
  const typesPath = path.join(base, "types", fileMap.types);
  if (!(await exists(typesPath))) {
    const content = `import type { z } from "zod";
import type { create${pascal}BodySchema, update${pascal}BodySchema, ${name}ParamsSchema, list${pascal}QuerySchema } from "../validators/${name}Validators.js";

export type Create${pascal}Body = z.infer<typeof create${pascal}BodySchema>;
export type Update${pascal}Body = z.infer<typeof update${pascal}BodySchema>;
export type ${pascal}Params = z.infer<typeof ${name}ParamsSchema>;
export type List${pascal}Query = z.infer<typeof list${pascal}QuerySchema>;
`;
    await writeFile(typesPath, content, "utf8");
  }

  // constants
  const constPath = path.join(base, "constants", fileMap.constants);
  if (!(await exists(constPath))) {
    const content = `export const ${name.toUpperCase()}_SEARCHABLE_FIELDS = ['name'] as const;\n`;
    await writeFile(constPath, content, "utf8");
  }

  // register in v1 routes
  const v1IndexPath = path.resolve(
    process.cwd(),
    "src",
    "routes",
    "v1",
    "index.ts",
  );
  try {
    if (await exists(v1IndexPath)) {
      let v1 = await (
        await import("node:fs/promises")
      ).readFile(v1IndexPath, "utf8");
      const importLine = `import { ${name}Routes } from "../../modules/${name}/index.js";`;
      if (!v1.includes(importLine)) {
        const insertBefore = "const router = Router();";
        const idx = v1.indexOf(insertBefore);
        if (idx !== -1) {
          v1 = v1.slice(0, idx) + importLine + "\n" + v1.slice(idx);
        } else {
          v1 = importLine + "\n" + v1;
        }

        const useLine = `router.use('/${name}', ${name}Routes);`;
        // insert after the router declaration line
        const routerIdx = v1.indexOf("const router = Router();");
        if (routerIdx !== -1) {
          const afterLineIdx = v1.indexOf("\n", routerIdx) + 1;
          v1 =
            v1.slice(0, afterLineIdx) + useLine + "\n" + v1.slice(afterLineIdx);
        } else {
          v1 += "\n" + useLine + "\n";
        }

        await (
          await import("node:fs/promises")
        ).writeFile(v1IndexPath, v1, "utf8");
      }
    }
  } catch {
    // non-fatal
  }

  process.stdout.write(`Created feature module: src/modules/${name}\n`);
  process.stdout.write(
    "Next: add your controllers/services and wire routes under /api/v1.\n",
  );
}

main().catch((err) => {
  process.stderr.write(err.message + "\n");
  process.exit(1);
});
