## Current Project Overview

This project is a TypeScript + Express + Prisma backend with PostgreSQL, Zod validation, pino logging, Swagger docs, Jest tests, and Husky/commitlint checks.

### Main folders

- `prisma/` — Prisma schema and generated migrations
- `src/config/` — logger and database bootstrap
- `src/controllers/` — request handlers
- `src/services/` — business logic
- `src/repositories/` — Prisma database queries
- `src/models/` — request/validation schemas and app-level models
- `src/middlewares/` — validation, error, and not-found handlers
- `src/routes/` — route aggregation and feature routes
- `src/utils/` — `ApiError`, `ApiResponse`, and `asyncHandler`
- `src/docs/` — Swagger setup

---

### Installed dependencies

Runtime:

- `express`
- `zod`
- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `cors`
- `helmet`
- `dotenv`
- `compression`
- `pino`
- `pino-http`
- `swagger-jsdoc`
- `swagger-ui-express`

Dev:

- `typescript`
- `tsx`
- `eslint`
- `prettier`
- `jest`
- `supertest`
- `husky`
- `lint-staged`
- `commitlint`

---

### How to run locally

1. Start PostgreSQL with Docker

```bash
docker compose up -d postgres
```

2. Create `.env` from `.env.sample`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodebe?schema=public"
PORT=5000
NODE_ENV=development
```

3. Push the Prisma schema to the database

```bash
npx prisma db push
```

4. Start the API server

```bash
npm run dev
```

---

### Available scripts

```bash
npm run dev          # start the API with tsx watch
npm run build        # compile TypeScript
npm run start        # run the compiled server
npm run lint         # run ESLint
npm run test         # run Jest
npm run prisma:migrate # create/apply a Prisma migration
npm run prisma:generate # regenerate the Prisma client
```

---

### Commit message format

This repo uses Conventional Commits through commitlint. Examples:

- `feat: add user api`
- `fix: handle validation error`
- `docs: update readme`
- `chore: update dependencies`

---

API Request Flow (summary)

- Client sends HTTP request to the app (example: `GET /api/users`).
- `src/app.ts` mounts global middleware and routes.
- Global middleware: `dotenv`, `express.json()` / `express.urlencoded()`, `cors`, `helmet`, `compression`, `httpLogger` (pino), and rate-limiter.
- Routing: `/api` → `src/routes/index.ts` → feature routers (e.g. `src/routes/user.routes.ts`).
- Per-route validation: `src/middlewares/validate.middleware.ts` parses input and stores validated data on `res.locals`.
- Controller: `src/controllers/*` receives validated input and calls the service layer.
- Service: `src/services/*` contains business logic and orchestrates repository calls.
- Repository: `src/repositories/*` uses the generated Prisma client (`src/config/db.ts`) to run queries against Postgres.
- Prisma executes SQL against Postgres using `DATABASE_URL` from `.env`.
- Controller returns standardized JSON via `src/utils/ApiResponse.ts`.
- Errors are handled centrally in `src/middlewares/error.middleware.ts` and returned as structured JSON.

Example (simple):

```bash
curl http://localhost:5000/api/users
```

route -> controller -> service -> repository -> Prisma

---

## Local PostgreSQL setup

- `schema.prisma` defines the `User` model
- `prisma.config.ts` reads `DATABASE_URL`
- `db.ts` connects Prisma to PostgreSQL
- `npx prisma db push` creates/updates the tables
- the app then uses Prisma to read/write users

Run Postgres with Docker:

```bash
docker compose up -d postgres
```

If you get a Docker pipe/engine error on Windows, start Docker Desktop first and wait until it shows as running.

Then copy [.env.sample](.env.sample) to [.env](.env) and keep:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodebe?schema=public"
```

Sync Prisma and start the API:

```bash
npx prisma db push
npm run dev
```

---

## Use this as a starter

After publishing, create a new project from npm with:

```bash
npm create nodebe@latest my-app
```

You can also run the binary directly:

```bash
npx create-nodebe my-app
```

The generator copies the starter files into the target folder, rewrites the generated `package.json` name to the new project folder, and then tells you to install dependencies and start the app.
