# UniStore Demo

UniStore is a **Next.js (App Router) + Node.js (Express + Prisma)** demo that showcases three entry points—storefront, admin, and CMS—plus feature flags, role switching, and a mock checkout flow. The project uses pnpm workspaces and can optionally integrate Unleash or Keystone.

## Project Structure

```text
apps/
  web/                # Next.js frontend (App Router)
    app/(store)       # Storefront routes
    app/(admin)       # Admin console routes
    app/(cms)         # CMS public routes
    components/       # Shared UI (Navbar / RoleSwitcher / Charts)
    lib/              # API SDKs, flag helpers, state stores
  backend/
    node-api/         # Express + Prisma REST API
infra/
  docker-compose.yml  # Postgres / Redis / Unleash / Node API services
scripts/
  seed.node.ts        # Demo data seeding script
```

## Quick Start

1. Install dependencies
   ```bash
   pnpm i
   ```
2. Start infrastructure (Postgres / Redis / Unleash / Node API image)
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
3. Create env files
   ```bash
   cp .env.example .env.local
   cp apps/backend/node-api/.env.example apps/backend/node-api/.env
   ```
4. Sync database and seed demo data
   ```bash
   pnpm --filter ./apps/backend/node-api prisma:migrate
   pnpm --filter ./apps/backend/node-api prisma:generate
   pnpm run seed:node
   ```
5. Launch services
   ```bash
   pnpm --filter ./apps/backend/node-api dev   # Node API (http://localhost:9101)
   pnpm --filter ./apps/web dev                # Next.js (http://localhost:3000)
   ```

## Highlights

- **Storefront flow**: browse products, add to cart, run a mock checkout, and view the confirmation page.
- **Admin console**: CRUD for products/orders/users plus a 7-day GMV chart powered by Recharts.
- **CMS module**: article list + detail views with simple admin CRUD.
- **Auth & Role Switcher**: toggle demo users between Admin/Customer with cookie-based guards.
- **Feature flags**: prefer Unleash, fall back to local env flags; the FlagToggle updates cookies and localStorage.
- **Demo fallback**: if the Node API is offline, the frontend falls back to `lib/mock` data for read-only browsing.

## Common Commands

```bash
pnpm i                               # Install workspace dependencies
pnpm --filter ./apps/web dev         # Start Next.js dev server
pnpm --filter ./apps/backend/node-api dev  # Start Node API
pnpm run seed:node                   # Seed demo data
pnpm --filter ./apps/web build       # Production build
```

## Environment Variables

`.env.example` contains the minimal set:
- `API_BASE_URL` / `NEXT_PUBLIC_API_URL`: Node API address (default `http://localhost:9101`).
- `DATABASE_URL`: PostgreSQL connection string.
- `FLAG_COMMERCE` / `FLAG_CMS` / `FLAG_ANALYTICS`: local feature flag defaults.
- `UNLEASH_*`: optional Unleash configuration.

## Next Steps

- TODO: add Vitest unit tests and Playwright E2E coverage for storefront/admin/CMS flows.
- TODO: extend `lib/mock` to support a fully offline demo mode.

Feel free to extend the backend modules, integrate Keystone, or automate more tests.
