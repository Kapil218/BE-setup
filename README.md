# NodeBE Starter (Modular Express + Prisma)

Production-ready backend starter with TypeScript, Express, Prisma, Swagger, Zod validation, and modular feature architecture.

## Project structure

```text
nodebe/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   ├── db.config.ts
│   │   ├── logger.ts
│   │   └── app.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   └── invoice/
│   ├── middlewares/
│   ├── routes/
│   │   └── v1/
│   ├── utils/
│   ├── types/
│   ├── jobs/
│   ├── docs/
│   ├── tests/
│   ├── app.ts
│   └── server.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── package.json
```

## API routing

- Base API mount: `/api`
- Health route: `GET /api/health`
- Versioned routes: `/api/v1/*`
- Current user routes: `/api/v1/users`
- Swagger UI: `/api-docs`

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Create environment file

```powershell
Copy-Item .env.example .env
```

or

```bash
cp .env.example .env
```

3. Start PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

4. Prepare Prisma

```bash
npx prisma generate
npx prisma db push
```

5. Run in dev mode

```bash
npm run dev
```

## Environment variables

Use `.env.example` as a template:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nodebe?schema=public"
NODE_ENV=development
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:migrate
npm run prisma:generate
npm run prisma:studio
```

## Use as starter package

Create a new app from npm:

```bash
npm create nodebe@latest my-app
```

Or run directly:

```bash
npx create-nodebe my-app
```

Then in the generated project:

```bash
cd my-app
npm install
npm run dev
```
