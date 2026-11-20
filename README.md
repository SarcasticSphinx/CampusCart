# CampusCart

A small campus store built for CSE 3206. Next.js App Router, TypeScript, Prisma 7, Neon PostgreSQL, Tailwind CSS, and shadcn/ui. All interface icons, including the favicon, use Lucide React. Keep business logic in small functions and add abstractions only when they solve a real problem.

## Features

Six functional modules:

1. **Catalogue**: products read from PostgreSQL with photographs, categories and prices.
2. **Search and filter**: name search, category filters and an empty-search state.
3. **Product details**: `/products/[id]` with description, specification table, stock and photo zoom.
4. **Shopping bag**: shadcn Sheet sidebar, quantity controls within stock, toasts, shared across pages (resets on refresh).
5. **Checkout and payment**: `/checkout` with promo codes (`STUDENT10`, `SAVE50`) and cash on delivery or a simulated campus wallet (declines orders above BDT 5,000; no real money moves).
6. **Orders and API**: stock reserved atomically, orders saved with price snapshots, receipt at `/orders/[id]`, JSON API documented with OpenAPI at `/api-docs`.

Accounts, per-customer order history and inventory administration are the next increment.

## Design patterns

All in `src/lib/checkout/`:

| Pattern | Category | Where |
| --- | --- | --- |
| Strategy | Behavioural | `discount.ts`: `DiscountStrategy` with `NoDiscount`, `PercentageDiscount`, `MinimumSpendDiscount` |
| Adapter | Structural | `payment.ts`: `CampusWalletAdapter` adapts `CampusWalletSimulator` to `PaymentGateway` |
| Builder | Creational | `order-builder.ts`: `OrderBuilder` assembles a validated `OrderDraft` |

`CheckoutService` depends only on the `CheckoutRepository` and `PaymentGateway` interfaces, so unit tests replace the database and payment provider with mocks.

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
npm run test:e2e   # Selenium; needs the app running on E2E_BASE_URL (default http://localhost:3000)
npm run docs:lint  # Redocly lint of the OpenAPI description in public/openapi.json
```

The API is documented with OpenAPI 3.1 in `public/openapi.json`. Run the app and open http://localhost:3000/api-docs for Swagger UI. `src/app/api/openapi.contract.test.ts` fails if a route handler is added without documenting it, or if the order response drifts from the schema.

Coverage measures the cart and checkout business logic (`src/lib/cart.ts`, `src/lib/checkout/`). The Prisma repository and route wiring are covered by the Selenium suite instead. Open `coverage/index.html` after a coverage run.

CI (`.github/workflows/ci.yml`) runs on every push and pull request. Job `checks`: lint, typecheck, OpenAPI lint, unit and contract tests with coverage, build. Job `selenium`: starts PostgreSQL 17 in a service container, migrates and seeds it, builds and starts the app, and runs the Selenium suite.

## Layout

```text
src/app/                 Routes and global styles
src/components/         Storefront and shadcn/ui components
src/lib/                Cart logic, product data, database client
prisma/                 Schema and seed; versioned migrations
docs/                   Requirements, development plan, learning evidence
.github/workflows/      Automated checks
```

## Git workflow

Branches are named `feat/<topic>`, `fix/<topic>`, `test/<topic>` or `docs/<topic>`, and reach `main` only through pull requests. Commit messages use `feat:`, `fix:`, `test:`, `docs:` and `chore:` prefixes.

## AI assistance

Parts of this project were written with AI assistance (OpenAI Codex for the initial scaffold, Claude Code for the checkout increment, tests and documentation). Every change was reviewed, run and tested before merging; commits made with Claude Code carry a `Co-Authored-By` trailer.
