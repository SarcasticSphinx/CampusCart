# CampusCart

A small campus store built for CSE 3206. Next.js App Router, TypeScript, Prisma 7, Neon PostgreSQL, Tailwind CSS, and shadcn/ui. All interface icons, including the favicon, use Lucide React. Keep business logic in small functions and add abstractions only when they solve a real problem.

## Current increment

- Minimal responsive catalogue with category filters and search.
- In-memory shopping bag with quantity controls, stock limits, and integer money calculations.
- Database-backed catalogue, Prisma schema for users, products, orders, and order items; reusable server-only client and repeatable product seed.
- Cart unit tests, coverage reporting, and a GitHub Actions workflow.

The homepage reads products from Neon on the server at request time. The seed supplies the initial six products. The cart resets on refresh. Authentication, checkout, persistent carts, admin screens, design patterns, Selenium tests, and the final lab report remain future increments. The database schema alone is not evidence of a working persistent application.

## Run locally

Use Node.js 24 LTS and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Configure the database below before opening the shop. The loading state appears while products are fetched; connection errors show a retry screen.

## Connect Neon

1. Create a Neon project and copy its PostgreSQL connection string.
2. Copy `.env.example` to `.env` and replace the placeholder `DATABASE_URL`. Keep `sslmode=require` from the Neon connection string. Never commit credentials or use a `NEXT_PUBLIC_` variable for the database URL.
3. Apply the schema and seed your development database:

```bash
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run db:studio
```

The initial migration is committed. For later schema changes, generate and commit development migrations using `npm run db:migrate -- --name describe_change`. Apply existing migrations using `npx prisma migrate deploy`. Do not run development migrations or seeds against a production database. The catalogue queries through `getDb()` in `src/lib/db.ts`; never import database code into a Client Component.

Prisma maps models in `prisma/schema.prisma` to database tables and generates typed query methods, such as `db.product.findMany()`. A migration records a schema change; a seed supplies initial data. See https://www.prisma.io/docs/guides/v7/frameworks/nextjs and https://ui.shadcn.com/docs/installation/next.

## Checks

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Coverage currently measures only cart business logic, not the UI, database integration, or the whole application. Open `coverage/index.html` after a coverage run. CI is configured for pushes and pull requests; check the Actions tab for actual hosted results.

## Layout

```text
src/app/                 Routes and global styles
src/components/         Storefront and shadcn/ui components
src/lib/                Cart logic, product data, database client
prisma/                 Schema and seed; versioned migrations
docs/                   Requirements, development plan, learning evidence
.github/workflows/      Automated checks
```

## Git and academic evidence

Use `feat/<topic>`, `fix/<topic>`, `test/<topic>`, and `docs/<topic>` branches. Make small commits describing real changes. Open PRs with a short explanation and validation results. Record genuine review feedback and revisions; do not fabricate reviews or backdate work. Record a real merge conflict and its resolution when one occurs.

The scaffold and initial implementation were created with Codex assistance. The student must review, understand, adapt, and disclose this assistance in the report. Git authorship configuration does not imply the work was written without AI. Do not submit generated reflection text as personal learning evidence.
