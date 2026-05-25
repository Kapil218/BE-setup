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
