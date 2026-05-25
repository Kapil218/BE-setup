# Step 1 — Initialize Project

```bash
npm init -y
git init
```

- What: Created Node project and local Git repository.
- Why: `npm init` produces `package.json` for dependency and script management; `git init` starts version control.
- Files/folders created:
  - [package.json](package.json)
  - `.git/`
- Notes: `package.json` will be updated with scripts/deps as setup continues.

# Step 2 — Create base folders and keep-empty placeholders

```bash
mkdir -p src public prisma src/config src/controllers src/middlewares src/models src/routes src/utils
type NUL > public/.gitkeep
```

- What: Project directory structure and `.gitkeep` to preserve empty `public/`.
- Why: Keep empty directories tracked in Git and prepare feature areas.
- Files/folders created:
  - `public/.gitkeep`
  - `src/`, `prisma/`, `src/config/`, `src/controllers/`, `src/middlewares/`, `src/models/`, `src/routes/`, `src/utils/`

# Step 3 — Add environment files

```bash
type NUL > .env
type NUL > .env.example
```

- What: `.env` for local secrets and `.env.example` as a template.
- Why: Keep secrets out of VCS and provide onboarding values for contributors.
- Typical entries: `PORT`, `DATABASE_URL`, `NODE_ENV`.
- Config change: add `.env` to `.gitignore` (see Step 4).

# Step 4 — Create `.gitignore`

```bash
echo "node_modules/\n.env\ndist/\n.env.local\n.DS_Store" > .gitignore
```

- What: Ignore dependencies, env files, and build outputs.
- Why: Prevent committing `node_modules` and secrets.

# Step 5 — Add `src` entry files (`constants`, `app`, `server`)

```bash
type NUL > src/constants.js
type NUL > src/app.ts
type NUL > src/server.ts
```

- What: Created `src/constants.js`, `src/app.ts`, `src/server.ts` entry points.
- Why: `constants` centralizes config; `app.ts` builds Express app; `server.ts` bootstraps the HTTP server.
- Important: Export the Express `app` from `app.ts` for `supertest` tests.

# Step 6 — Add feature folders

```bash
mkdir -p src/controllers src/middlewares src/models src/routes src/utils src/config
```

- What: Created modular folders for controllers, middlewares, models, routes, utils, and config.
- Why: Organize code by responsibility to simplify maintenance and testing.

# Step 7 — Implement core utils: `ApiError`, `ApiResponse`, `asyncHandler`

- What: Utility modules to standardize errors, responses and async route handling.
- Why: Reduce duplication and ensure consistent API output and error flow.
- Files to add (examples):
  - `src/utils/ApiError.ts` — custom error class with `status`, `code`, `payload`.
  - `src/utils/ApiResponse.ts` — standardized success/error response helper.
  - `src/utils/asyncHandler.ts` — wrapper to `try/catch` async route handlers and `next(err)`.
- Usage: `router.get('/', asyncHandler(controller.list))` and `throw new ApiError(400, 'Invalid input')`.

# Step 8 — Add dev tooling (nodemon, tsx, TypeScript, Jest, ESLint, Prettier)

```bash
npm install -D nodemon tsx typescript jest ts-jest @types/jest eslint prettier husky lint-staged commitlint @commitlint/config-conventional
```

- What: Installed developer tooling for faster iteration, typing, testing, and commit hygiene.
- Why: Use `tsx`/`nodemon` for rapid dev reloads, `typescript` for types, `jest` for tests, `eslint`/`prettier` for quality, `husky`/`lint-staged`/`commitlint` for git hooks.
- `package.json` scripts example:

```json
"scripts": {
	"dev": "nodemon --watch src --exec \"tsx src/server.ts\"",
	"build": "tsc",
	"test": "jest"
}
```

- Config files to add/update: `tsconfig.json`, `jest.config.cjs`, `eslint.config.mjs`, `commitlint.config.cjs`.

# Step 9 — Install runtime dependencies

```bash
npm install express zod prisma @prisma/client cors helmet dotenv compression pino pino-http supertest
```

- What: Runtime libraries for server, validation, DB, security, compression and logging.
- Why: `express` for HTTP, `zod` for validation, `prisma` + `@prisma/client` for DB access, `cors` and `helmet` for security, `compression` for gzipping responses, `pino`/`pino-http` for structured logging.
- Note: Add `@types/*` where necessary for TypeScript.

# Step 10 — Initialize and configure Prisma

```bash
npx prisma init
# edit prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma generate
```

- What: Initialize Prisma schema, run migrations and generate the typed client.
- Why: Database schema management and typed DB client for repositories.
- Files created/modified:
  - `prisma/schema.prisma`
  - `prisma/migrations/`
  - `src/prisma.config.ts` or `prisma.config.ts` (singleton wrapper)
  - repository examples like `prisma/user.repository.ts`.
- Config change: ensure `DATABASE_URL` present in `.env` prior to running migrations.
- Fix: Use a Prisma singleton to avoid multiple clients in development hot-reloads.

# Step 11 — Implement middlewares (error, validate, asyncHandler wiring)

- What: Middlewares to centralize error handling and request validation.
- Why: Keep controllers focused on business logic and provide consistent errors.
- Files to add:
  - `src/middlewares/error.middleware.ts` — maps `ApiError` and unknown errors to JSON responses.
  - `src/middlewares/validate.middleware.ts` — validates request bodies/params using `zod`.
- Important: Register error middleware as the last middleware in `app.ts`.

# Step 12 — Add route aggregator and API response wiring

```bash
type NUL > src/routes/index.ts
```

- What: `routes/index.ts` imports and mounts all module routers (e.g., `/users`).
- Why: Single point to register routes and apply shared middleware like auth or rate-limiting.
- Example structure:

```
src/
	routes/
		index.ts
	controllers/
		user/
			user.controller.ts
			user.routes.ts
```

# Step 13 — Add logging and Swagger docs

```bash
npm install swagger-jsdoc swagger-ui-express
```

- What: Add `pino` for structured logs and Swagger for API docs.
- Why: `pino` for production logging; Swagger UI for interactive API exploration during development.
- Files to add/update:
  - `src/config/logger.ts` (pino setup)
  - `src/docs/swagger.ts` (OpenAPI spec generation)
  - mount Swagger UI at `/api/docs` in `app.ts`.

# Step 14 — Testing, linting, and commit hooks

```bash
npm install -D supertest @types/supertest
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

- What: Configure `jest` + `supertest` for tests; `eslint`/`prettier` for code quality; `husky` + `lint-staged` + `commitlint` for developer workflow.
- Why: Enforce automated checks before code is committed and run tests in CI.
- Config files to add: `jest.config.cjs`, `.husky/*`, `lint-staged` config, `commitlint.config.cjs`.

# Step 15 — Docker, CI/CD, and final checklist

- What: Add Dockerfile, docker-compose and CI templates (placeholder step).
- Why: Reproducible build and deployment pipelines.
- Files to add later: `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`.
- Notes: Keep secrets out of images and use build args / CI secrets for `DATABASE_URL`.

# Step 16 — Finalize README and project checklist

- What: Collate the steps and tool purposes in `README.md` and `SETUP.md` (this file).
- Why: Provide a concise chronological build log for onboarding and reproducibility.
- Files updated: `README.md`, `SETUP.md`.

---

Next recommended actions (optional):

- Generate example source files (`src/app.ts`, `src/server.ts`, `src/utils/ApiError.ts`) and update `package.json` scripts.
- Add `Dockerfile` and CI pipeline templates.
