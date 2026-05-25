#!/usr/bin/env node

import { rm, readFile, writeFile, access } from "node:fs/promises";
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

async function main() {
  const nameArg = process.argv[2];

  if (!nameArg) {
    process.stderr.write("Usage: delete-feature <name>\n");
    process.exit(1);
  }

  const name = normalize(nameArg);
  const base = path.resolve(process.cwd(), "src", "modules", name);

  if (!(await exists(base))) {
    process.stderr.write(`Module not found: ${base}\n`);
    process.exit(1);
  }

  // remove directory
  await rm(base, { recursive: true, force: true });

  // update v1 index
  const v1IndexPath = path.resolve(
    process.cwd(),
    "src",
    "routes",
    "v1",
    "index.ts",
  );
  try {
    if (await exists(v1IndexPath)) {
      let v1 = await readFile(v1IndexPath, "utf8");

      const importRegex = new RegExp(
        `import\\s+\\{\\s*${name}Routes\\s*\\}\\s+from\\s+["']\\.\\.\\/\\.\\.\\/modules\\/${name}\\/index\\.js["'];?\\n?`,
        "g",
      );

      const useRegex = new RegExp(
        `router\\.use\\(\\s*["'\`]\\/${name}["'\`]\\s*,\\s*${name}Routes\\s*\\)\\s*;?\\n?`,
        "g",
      );

      v1 = v1.replace(importRegex, "");
      v1 = v1.replace(useRegex, "");

      await writeFile(v1IndexPath, v1, "utf8");
    }
  } catch {
    // non-fatal
  }

  process.stdout.write(`Deleted feature module: src/modules/${name}\n`);
}

main().catch((err) => {
  process.stderr.write(err.message + "\n");
  process.exit(1);
});
