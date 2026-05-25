route -> controller -> service -> repository -> Prisma

## Local PostgreSQL

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

## User schema, DB setup, and request flow

1. Prisma model (prisma/schema.prisma)

```prisma
model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    createdAt DateTime @default(now())
}
```

2. Create tables in Postgres

- Copy `.env.sample` to `.env` and set `DATABASE_URL`.
- Run:

```bash
npx prisma db push   # or: npx prisma migrate dev --name init
npx prisma generate
```

This syncs the Prisma schema to your Postgres DB and generates `@prisma/client`.

3. How a `GET /api/users` or `POST /api/users` request flows

- Client -> HTTP request to Express (`/api/users`).
- `routes/user.routes.ts` defines the route and runs `validate` middleware.
- Controller (`src/controllers/user/user.controller.ts`) receives parsed input and calls the service.
- Service (`src/services/user.service.ts`) contains business logic and calls the repository.
- Repository (`src/repositories/user.repository.ts`) uses the generated Prisma client (`src/config/db.ts`) to run DB queries.
- The controller wraps results in `ApiResponse` and sends JSON back.
- Errors bubble to `error.middleware.ts` and are serialized consistently.

4. Example curl requests

```bash
curl -X POST http://localhost:5000/api/users \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com"}'

curl http://localhost:5000/api/users
```

5. Files to inspect

- `prisma/schema.prisma` — Prisma schema
- `src/config/db.ts` — Prisma client bootstrap
- `src/repositories/user.repository.ts` — DB queries
- `src/services/user.service.ts` — business logic
- `src/controllers/user/user.controller.ts` — request/response
- `src/routes/user.routes.ts` — route declarations

If you'd like, I can add a small diagram or a Postman collection next.

npm init - git init
create .gitkeep for empty folders like in public is empty now
add env files
git ignore with env genarator
add src folder with constant - app - server files
add controller - middlewares - models - routes - utils - config
in utils add apierror apiresponse asynchandler
add nodemon for auto reload (dev dependency)

add dependency -
typescript
eslint
prettier
jest
husky
lint-staged
commitlint

| Tool        | Purpose                |
| ----------- | ---------------------- |
| TypeScript  | type safety            |
| ESLint      | code quality           |
| Prettier    | formatting             |
| Jest        | testing                |
| Husky       | git hooks              |
| lint-staged | lint only staged files |
| Commitlint  | proper commit messages |

    express
    zod
    prisma
    cors
    helmet
    dotenv
    compression
    pino
    pino
    supertest
    tsx

| Tool        | Purpose                 |
| ----------- | ----------------------- |
| express     | API server              |
| zod         | validation              |
| prisma      | ORM/database            |
| cors        | frontend access         |
| helmet      | security                |
| dotenv      | env vars                |
| compression | gzip responses          |
| pino        | structured request logs |
| pino        | structured logs         |
| supertest   | API testing             |
| tsx         | TS runtime/dev server   |

Add Prisma singleton
error.middleware.ts
asyncHandler.ts
validate.middleware.ts
ApiResponse.ts
routes/index.ts

nodebe/
├── .husky/
│
├── prisma/ # Prisma schema & migrations
│ ├── migrations/
│ └── schema.prisma
│
├── src/
│ │
│ ├── config/ # App configuration
│ │ ├── env.ts
│ │ ├── logger.ts
│ │ ├── db.ts
│ │ └── constants.ts
│ │
│ ├── modules/ # Feature/module based architecture
│ │ │
│ │ ├── auth/
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.repository.ts
│ │ │ ├── auth.routes.ts
│ │ │ ├── auth.validation.ts
│ │ │ ├── auth.types.ts
│ │ │ └── auth.constants.ts
│ │ │
│ │ ├── user/
│ │ │ ├── user.controller.ts
│ │ │ ├── user.service.ts
│ │ │ ├── user.repository.ts
│ │ │ ├── user.routes.ts
│ │ │ ├── user.validation.ts
│ │ │ ├── user.types.ts
│ │ │ └── user.constants.ts
│ │ │
│ │ ├── invoice/
│ │ ├── payment/
│ │ └── etc...
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── validate.middleware.ts
│ │ ├── rateLimit.middleware.ts
│ │ └── upload.middleware.ts
│ │
│ ├── routes/
│ │ └── index.ts # Combine all module routes
│ │
│ ├── utils/
│ │ ├── ApiError.ts
│ │ ├── ApiResponse.ts
│ │ ├── asyncHandler.ts
│ │ ├── pagination.ts
│ │ ├── generateToken.ts
│ │ ├── hash.ts
│ │ └── helpers.ts
│ │
│ ├── types/
│ │ ├── express.d.ts
│ │ └── common.types.ts
│ │
│ ├── jobs/ # Cron jobs / background jobs
│ │
│ ├── docs/ # Swagger/OpenAPI setup
│ │
│ ├── tests/
│ │ ├── setup.ts
│ │ ├── unit/
│ │ └── integration/
│ │
│ ├── app.ts # Express app config
│ └── server.ts # Server bootstrap
│
├── .env
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── commitlint.config.js
├── jest.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
