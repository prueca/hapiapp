# hapiapp — Agent Context

## Project overview

`hapiapp` (package `hapiapp-ui`) is built for Select Ice Cream Philippines as a platform for
its multi-tier distribution network: distributors, dealers, hapistores, and direct accounts.

It exists to replace the company's missing system for managing accounts, users, and assets
(freezers and their deployments), plus products, orders, and bad-order handling. The system's
purpose is to solve the company's two biggest problems: asset loss and sales loss.

The network is a multi-tier hierarchy in which a distributor manages dealers, direct accounts,
and hapistores.

## Glossary & domain model

### Account types (`src/lib/config/account.types.ts` → `account_type` enum)

`distributor` · `dealer` · `hapistore` · `direct_store`

- **distributor** — top of the hierarchy; owns the warehouse and downstream accounts.
- **dealer** — middle tier; operates a warehouse and resells to hapistores.
- **hapistore** — leaf reseller (small outlet) that sells direct to consumers.
- **direct account** — first-class account type, the enum value is `direct_store` (examples:
  7-Eleven, supermarkets). "Direct account" and `direct_store` are the same thing.

Terminology note: some older docs and a schema comment call the leaf tier "franchisee"; the
canonical enum spelling is `hapistore`, with `direct_store` for direct accounts. Standardize on
the `src/lib/config/*` spellings.

### Roles (`src/lib/config/user.roles.ts` → `user_role` enum)

Every account type has an `*-admin` and `*-user` variant (8 roles total, e.g. `distributor-admin`,
`dealer-user`, `hapistore-admin`, `direct-store-user`). Admin roles perform management
operations; user roles have the read/operational scope of their tier.

### Hierarchy

Accounts form a recursive tree via `account.parentId` (a ULID into `account`). The create
endpoint enforces that a parent may only create *lower* tiers — an account equal to or higher
than the user's own type cannot be created. Enforced in
`src/routes/api/accounts/create/+server.ts` via a scope map:

- distributor → may create `dealer`, `hapistore`, `direct_store`
- dealer → may create `hapistore`

### Domain vocabulary (grounded in `src/lib/config/*`, mirrored into
`src/lib/drizzle/schema/enum.ts`)

- **cabcon** — monthly reconciliation of a deployed freezer by scanning its barcode together
  with a watermarked "code of the month". Item status: `matched` · `mismatch` · `manual-submit`.
  Code-of-month (period) status: `open` · `closed`.
- **deployment** — logistics state of a freezer shipment: `pending` · `processing` ·
  `to-be-delivered` · `in-transit` · `delivered` · `cancelled`.
- **freezer status** — `housed - available` · `for deployment` · `deployed - designated` ·
  `for pullout` · `pullout` · `for replacement - broken unit` · `for replacement - downgrade` ·
  `for replacement - upgrade`.
- **order status** — `pending` · `confirmed` · `processing` · `delivered` · `cancelled`.
- **product** — category (e.g. Combination Packs, Tub varieties, Novelties, Limited Edition),
  packaging (Box/Cone/Cup/Gallon/Pint/Stick/Tub), and "enlisted for"
  (for direct account / for dealers / all).

## System management

Domains are generally implemented as CRUD operations with matching API and UI.

### Per-tier responsibilities

**Distributor** — top tier.
- Manage dealer, direct-store, and hapistore accounts.
- Track freezers and manage deployments.
- Distribute products to direct and dealer accounts.
- Handle orders and bad orders.

**Dealer** — middle tier / warehouse.
- Manage hapistore accounts.
- Track freezers and manage deployments; store freezers on their premises or in warehouse and
  report them.
- Distribute products to direct and hapistore accounts.
- Handle orders and bad orders.

**Hapistore** — leaf reseller.
- Make orders.
- Report the freezers deployed at their premises to the system.

### Cross-cutting

- Distributors and dealers are responsible for prospecting new hapistores and their locations.
- Asset tracking is performed via cabcon (barcode + code of the month scan).
- Monitoring of the application's domains is centralized and generally visible across accounts and
  users.

## Development state & structure

The application is in an **early stage**. The distributor tier is fully built; the system is
expected to be completed top-down and then refined bottom-up.

**Exists today:**
- UI routes: `src/routes/distributor` (full), `src/routes/dealer` (UI placeholder pages only —
  no backing API), plus `account`, `login`, `scan`, `capture`, and `components`.
- API routes: `src/routes/api/distributor` (cabcon, deployments, product) and the shared
  `accounts`, `users`, `freezers`, `login`, `logout`, and `authorize` subtrees.
- Schema: `src/lib/drizzle/schema/` — `account`, `user`, `access`, `freezer`, `deployment`,
  `cabcon`, `product`, `enum`.

**Roadmap (NOT built yet — do not assume these paths exist):**
- `src/routes/api/dealer`, `src/routes/api/hapistore`, and `src/routes/hapistore` do not exist.
  Dealer UI pages exist but have no backing API.
- No `order` / `bad_order` schema tables yet — only the `order.status` enum and UI placeholders.
  Freezer model/brand/capacity choices live in `src/lib/config/freezer.options.ts`.

## Tech stack

- Frontend: SvelteKit 5 (Svelte 5), Vite, Tailwind v4 (with daisyui, `@tailwindcss/forms`,
  `@tailwindcss/typography`).
- Backend: same SvelteKit server routes (`@sveltejs/adapter-node`) — SvelteKit hosts both UI and
  API.
- Data: PostgreSQL with the Drizzle ORM.
- TypeScript.
- Package manager: **yarn** (see `yarn.lock`). Use `yarn <script>`, not `npm`.
- Client API calls go through `src/lib/api.ts` (`ky`, base URL `PUBLIC_API_URL`, cookie
  credentials).

## Conventions

### API handlers (`src/routes/api/**/+server.ts`)

Pattern to mirror when adding endpoints (see `src/routes/api/accounts/create/+server.ts`):
1. Validate the request body with `zod`.
2. Gate the operation with a `switch` on `locals.user.role` using `userRoles`.
3. Run writes inside `db.transaction(...)`.
4. On DB errors, map the Postgres `code` via `_.get(e, 'cause.code', null)` to a centralized
   error + an `http-status-codes` status (e.g. `23505`→`CONFLICT`/`DATA_CONFLICT`,
   `23503`→`UNPROCESSABLE_ENTITY`/`FOREIGN_KEY_VIOLATION`, `23502`→`BAD_REQUEST`,
   `23514`→`CHECK_CONSTRAINT_VIOLATION`, `22P02`→`INVALID_DATA_FORMAT`).
5. Return success as `json({ data: ... })`.

Errors are centralized in `src/lib/errors.ts`; always reuse them rather than ad-hoc messages.

### Authentication / authorization (`src/routes/api/login`, `.../authorize`)

- Two JWT cookies: an auth token (`AUTHORIZATION_TOKEN_COOKIE`) and a session access token
  (`ACCESS_TOKEN_COOKIE`, httpOnly/secure, ~30-day validity).
- Route access is enforced by role in `+layout.server.ts` (a root layout plus per-tier layouts
  that `redirect` to `/login` when unauthenticated and `error(UNAUTHORIZED)` for the wrong role).
- Server routes read the authenticated caller from `locals` (`locals.user`, `locals.account`).

### Single source of truth for enums

`src/lib/config/*.ts` are the source of truth for every status/type list; they are mirrored into
`src/lib/drizzle/schema/enum.ts`. When adding or changing a status or type value, update **both**
the `config` file and the `enum.ts` mirror.

## Commands

- `yarn dev` — start the dev server
- `yarn build` / `yarn preview` — build / preview a production build
- `yarn check` — typecheck (svelte-check) — **the validation gate**
- `yarn lint` — `prettier --check .` + `eslint .` — **the validation gate**
- `yarn format` — `prettier --write .`
- `yarn db:generate` / `yarn db:migrate` / `yarn db:push` / `yarn db:studio` — Drizzle

**Acceptance bar:** after any change, `yarn check && yarn lint` must pass.

## Key locations

- `src/lib/config/*` — enums and constant option lists (single source of truth).
- `src/lib/drizzle/schema/*` — database tables (`account`, `user`, `access`, `freezer`,
  `deployment`, `cabcon`, `product`, `enum`).
- `src/lib/errors.ts` — centralized error codes/messages.
- `src/lib/api.ts` — client HTTP client.
- `src/routes/<tier>/` — UI pages (distributor full, dealer partial).
- `src/routes/api/<tier>/` and `src/routes/api/<shared>` — server API endpoints.
- `src/routes/**/+layout.server.ts` — per-tier auth/role gating.
- `instruction.md` — the current task file (when present).

## Exclusions

Do not treat these as production code or agent context:
- `_mock` — mock data, not real data.
- `_scratch` — scratch/experimental work.
- `drizzle` — generated Drizzle migration output.
- `FLOW.md` — deferred process docs (cabcon/deployment flows); kept out of context for now.
  Revisit when dealer/hapistore flows are needed.

## Safety

- Never commit secrets. `.env` / `.env.example` hold secrets (`ACCESS_TOKEN_SECRET`,
  `AUTHORIZATION_TOKEN_SECRET`, `DB_URL`, …).
- Never log secrets, tokens, or database URLs.

## Instructions

Work is assigned primarily via the prompt when present, and via `instruction.md` when a written
task file is provided. Read `instruction.md` for the *current* task.
