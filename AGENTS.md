# Repository Guidelines

## Project Structure & Module Organization
- `apps/web/` hosts the Next.js App Router front end with three segment roots: `(store)/store` for the customer storefront, `(admin)/admin` for operations tooling, and `(cms)/cms` for editorial flows.
- `apps/web/lib/` centralizes API clients, feature flag helpers, and mock adapters; keep backend-specific code under `lib/sources/*` to let us swap Saleor or Medusa.
- `apps/backend/` contains the optional Saleor (`saleor/`) and Medusa (`medusa/`) stacks, while `apps/cms/` is reserved for the Keystone bridge when the external CMS is enabled.
- `infra/` carries Docker Compose definitions and Unleash seeds, and `scripts/` stores seeding and alignment utilities.

## Build, Test, and Development Commands
- `pnpm i` installs monorepo dependencies.
- `docker compose -f infra/docker-compose.yml up -d` starts databases, Unleash, and the chosen commerce engine.
- `pnpm --filter ./apps/web dev` launches the web app locally on port 3000.
- `pnpm run seed:saleor` or `pnpm run seed:medusa` populates demo catalog, orders, and users via the matching backend.
- `pnpm --filter ./apps/web build` performs the production build and catches type issues.

## Coding Style & Naming Conventions
- Follow Next.js and TypeScript defaults: 2-space indentation, PascalCase for components, camelCase for hooks and helpers, and SCSS modules named `Component.module.scss` when needed.
- Centralize feature flag lookups in `lib/flags.ts` using `getFlag('commerce')`; annotate demo fallbacks with `// demo-mode:` comments.
- Keep API surface wrappers typed and colocated with their domain (`lib/commerce/*`, `lib/cms/*`).

## Testing Guidelines
- Use Playwright for end-to-end coverage (`pnpm --filter ./apps/web test:e2e`) and Vitest for unit tests (`pnpm --filter ./apps/web test:unit`).
- Name specs after the feature under test (e.g., `storefront.cart.spec.ts`).
- Aim for smoke coverage on storefront flows, admin analytics charts, and CMS CRUD before merging.

## Commit & Pull Request Guidelines
- Start commit subjects in imperative mood (e.g., `Add storefront cart slice`); keep bodies focused on motivation and follow-up tasks.
- Reference Jira or GitHub issues in the PR description, summarize test evidence, and attach screenshots for UI updates across store, admin, and CMS layouts.
- Confirm that feature flags and seed scripts were evaluated for regressions, especially when adding a new backend integration.

## Configuration & Security Tips
- Copy `.env.example` into `.env.local` and fill only the flags you need; secrets for Saleor, Medusa, or Keystone must never be committed.
- Prefer Unleash for shared environments; when falling back to local flags, document the decision in the PR summary.

## Communication Guidelines
- 与维护者交流请使用中文，以便更快获得反馈和评审。
