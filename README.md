# UniStore Demo

UniStore is a **Next.js (App Router) + Node.js (Express + Prisma)** demo that showcases three entry points—storefront, admin, and CMS—plus feature flags, role switching, and a mock checkout flow. The project uses pnpm workspaces and can optionally integrate Unleash or Keystone.

## Try It Online

Visit the live MVP at https://unistoredemo.vercel.app/ to explore the latest functionality.

## Project Structure

```text
apps/
  web/                    # Next.js App Router frontend
    app/(store)           # Storefront routes
    app/(admin)           # Admin console routes
    app/(cms)             # CMS publishing routes
    app/analytics         # Shared analytics entry point
    app/api               # Route handlers consumed by the frontend
    components/           # Shared UI (navigation, charts, role switchers)
    lib/                  # Data clients, feature flags, client/server stores
      api/                # REST wrappers for the Node API
      mock/               # Offline fixtures for demo mode
      store/              # Zustand stores and state helpers
    prisma/               # Frontend Prisma schema (readonly)
    server/               # Server utilities (flags, HTTP client, schemas)
  backend/
    node-api/             # Express + Prisma API service
      src/                # API routes, services, and middleware
      prisma/             # Prisma schema and migrations
infra/
  docker-compose.yml      # PostgreSQL / Redis / Unleash / API containers
scripts/
  seed.node.ts            # Demo data seeding script for the Node API
  package.json            # Local script dependencies
```

## Highlights

- **Storefront journey**: browse the catalog, add items to a cart backed by the Node API, complete a mock checkout, and land on an order confirmation view.
- **Admin workspace**: manage product listings, moderate CMS posts, review recent orders, adjust user roles, and chart 7-day order/GMV trends with Recharts.
- **CMS publishing**: ship articles through public list/detail pages while editors maintain content through the admin CMS manager.
- **Role-based access**: middleware enforces admin-only routes, and the in-app RoleSwitcher persists selections with cookies for quick toggling.
- **Feature flags**: `/api/flags` integrates with Unleash and falls back to env defaults; the FlagToggle writes overrides to cookies and localStorage.
- **Offline safety net**: storefront and CMS reads fall back to `lib/mock` fixtures when the Node API is unreachable, keeping the experience browsable.

## Environment Variables

The root `.env.example` bootstraps shared services:
- `NODE_ENV`, `APP_URL`, `PORT`: base runtime configuration for local development.
- `FLAG_COMMERCE`, `FLAG_CMS`, `FLAG_ANALYTICS`: feature flag fallbacks when Unleash is unavailable.
- `API_BASE_URL`, `NEXT_PUBLIC_API_URL`: endpoints consumed by the web app and Node API.
- `DATABASE_URL`, `SHADOW_DATABASE_URL`: PostgreSQL connection strings for Prisma migrations.
- `REDIS_URL`, `JWT_SECRET`: backing infrastructure used by the Node API.
- Keystone defaults (`KEYSTONE_URL`, `KEYSTONE_SESSION_SECRET`) for optional CMS integration.
- Unleash defaults (`UNLEASH_URL`, `UNLEASH_API_TOKEN`, `UNLEASH_PROJECT`) for remote feature flags.

The frontend `.env.local.example` only requires `NEXT_PUBLIC_API_URL`.

The Node API example at `apps/backend/node-api/.env.example` provides service-specific overrides including `PORT`, `DATABASE_URL`, `REDIS_URL`, and the feature flag fallbacks.

Feel free to extend the backend modules, integrate Keystone, or automate more tests.
