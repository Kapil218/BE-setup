# Project dependencies and purpose

Below is a concise mapping of installed packages and why they were chosen. Use the grouped install commands as a reference.

## Install commands

```bash
# Runtime dependencies
npm install express zod prisma @prisma/client cors helmet dotenv compression pino pino-http supertest

# Dev dependencies
npm install -D nodemon tsx typescript jest ts-jest @types/jest eslint prettier husky lint-staged commitlint @commitlint/config-conventional @types/supertest

# Swagger and docs
npm install swagger-jsdoc swagger-ui-express
```

## Runtime dependencies

- **express**: Core HTTP server framework used to define routes, middleware, and request handling.
- **zod**: Schema validation library used to validate request payloads and inputs.
- **prisma**: Database toolkit for schema, migrations and generating the typed client.
- **@prisma/client**: Generated Prisma client used at runtime to interact with the database.
- **cors**: Enables Cross-Origin Resource Sharing for front-end access control.
- **helmet**: Adds HTTP headers to improve security (CSP, XSS protections, etc.).
- **dotenv**: Loads `.env` environment variables into `process.env`.
- **compression**: Gzip compresses responses to reduce bandwidth.
  // Removed morgan: using pino/pino-http for both dev and production logging.
- **pino**: Structured, high-performance logger for production use.
- **supertest**: Integration testing helper to exercise server routes in tests.

## Dev dependencies (tooling)

- **typescript**: Adds static typing and transpilation for the codebase.
- **tsx**: Lightweight TypeScript runtime for running `.ts` files without a build step during development.
- **nodemon**: Watches files and restarts the server during development (used with `tsx`).
- **jest**: Unit and integration test runner.
- **ts-jest**: Jest transformer to run TypeScript tests.
- **@types/jest**: Type definitions for Jest.
- **eslint**: Linting tool for code quality and stylistic rules.
- **prettier**: Code formatter to enforce consistent style.
- **husky**: Git hooks manager used to run scripts on commit/pre-commit.
- **lint-staged**: Runs linters against staged Git files only.
- **commitlint**: Enforces commit message style (with `@commitlint/config-conventional`).
- **@types/supertest**: TypeScript types for `supertest`.

## Docs & API tooling

- **swagger-jsdoc**: Generates OpenAPI spec from JSDoc comments.
- **swagger-ui-express**: Serves interactive Swagger UI for the generated OpenAPI spec.

## Notes and integration tips

- Use `dotenv` early in `src/app.ts` or `src/server.ts` to load `DATABASE_URL` before initializing Prisma.
- Use a Prisma singleton (exported client) to avoid multiple instances when hot-reloading.
- Run `nodemon` or `tsx` in `dev` scripts to iterate quickly without building.
- Use `pino`/`pino-http` as the single logger. For readable console output in development, use `pino-pretty`.
- Configure `husky` with a `pre-commit` hook to run `lint-staged`, and `commitlint` as a `commit-msg` hook.

For any missing dependency or changes, update `package.json` and this file accordingly.
