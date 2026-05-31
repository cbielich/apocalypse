# Naming Conventions

> Naming patterns used across the codebase. Update this file when a new pattern is introduced or an existing one changes.

## Backend

TypeScript, CommonJS modules, run via `tsx`.

### Models / Entities
- No ORM/model classes. Domain shapes are plain `interface`s (PascalCase), e.g. `Jet`, `Snapshot`, `Status`, declared near where they're used (`sources/types.ts`, `poller/poll.ts`, `services/baseline.ts`).

### Controllers / Handlers
- No controller classes. Route handlers are registered inline in `routes.ts` via `app.get(...)`. Business logic lives in `services/` as named functions (camelCase), e.g. `getStatus`.

### Database Tables
- snake_case, plural: `counts`.

### Columns
- snake_case: `id`, `ts`, `count`, `hour_of_week`. Timestamps are epoch-ms integers named `ts` / `*_at` style.

### Routes
- kebab/lowercase under `/api`, noun-based: `/api/status`, `/api/jets`, `/api/history`, `/api/health`.

### Migrations
- None yet. Schema is declared idempotently (`CREATE TABLE IF NOT EXISTS`) in `db.ts`.

### Files & Folders
- camelCase file names (`baseline.ts`, `registry.ts`); folders are lowercase, grouped by role (`jets/`, `sources/`, `poller/`, `services/`).
- Constants exported in SCREAMING_SNAKE_CASE (`BUSINESS_JET_TYPES`).

## Frontend

TypeScript, Next.js App Router, React 19.

### Page Components
- App Router convention files: `page.tsx`, `layout.tsx`, `route.ts`. Default-exported component is PascalCase (`Home`, `RootLayout`).

### Reusable Components
- PascalCase file and component name, one per file: `Indicator.tsx`, `JetMap.tsx`, `AdSlot.tsx`. `'use client'` only where interactivity is needed (`JetMap`).

### Hooks / Composables
- None yet. Would be `useXxx` in `src/lib/` or `src/hooks/`.

### State / Stores / Contexts
- None yet. Local component state via React hooks.

### Files & Folders
- `src/app/` routes, `src/components/` UI, `src/lib/` shared logic. Component files PascalCase; lib files camelCase (`api.ts`).

### Variables & Functions
- camelCase functions (`fetchStatus`, `fetchJets`); PascalCase types/interfaces (`Status`, `Jet`); SCREAMING_SNAKE_CASE module constants (`PLANE_SVG`, `STYLE`, `COLORS`).

### Styling
- Plain CSS in `globals.css`, kebab-case class names (`jet-marker`, `ad-slot`, `map-section`), CSS custom properties for theme (`--bg`, `--panel`, `--border`). Mobile-first with `clamp()` for fluid sizing.
