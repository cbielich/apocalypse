# File Organization

> Where every file type lives. Update this file when a new top-level directory is added or the layout shifts.

Monorepo: two independently-Dockerized apps (`backend/`, `frontend/`) orchestrated by `docker-compose.yml` at the root.

## Backend

Fastify + TypeScript (run via `tsx`, no build step). SQLite via `better-sqlite3`.

```
backend/
├── Dockerfile
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts            # Fastify bootstrap: CORS, routes, error handler, cron poller
    ├── config.ts           # env-driven config (ports, cron, data source URLs, thresholds)
    ├── db.ts               # better-sqlite3 connection + schema (counts table)
    ├── routes.ts           # all /api route handlers
    ├── jets/
    │   ├── types.ts        # BUSINESS_JET_TYPES (ICAO type designator allowlist)
    │   └── registry.ts     # downloads OpenSky aircraft CSV -> icao24 set, cached on disk
    ├── sources/
    │   ├── types.ts        # JetSource interface + Jet type (the swappable provider seam)
    │   └── opensky.ts      # OpenSky implementation of JetSource
    ├── poller/
    │   └── poll.ts         # runPoll(): fetch -> filter -> store; holds latest snapshot in memory
    └── services/
        └── baseline.ts     # getStatus(): baseline + anomaly level from the counts table
```

Runtime data (SQLite db, cached CSV/registry) lives in `DATA_DIR` (`/data` in Docker, a named volume; `backend/data/` locally) — gitignored.

## Frontend

Next.js (App Router, SSR) + MapLibre. Standalone output for Docker.

```
frontend/
├── Dockerfile
├── package.json
├── tsconfig.json
├── next.config.js          # output: 'standalone'
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx       # root layout, metadata, viewport
    │   ├── page.tsx         # Home (SSR): indicator + map + ad slots
    │   ├── globals.css      # global + responsive styles
    │   └── api/
    │       └── [...path]/
    │           └── route.ts # runtime proxy to BACKEND_INTERNAL (browser-side fetches)
    ├── components/
    │   ├── Indicator.tsx    # server component: status dial
    │   ├── JetMap.tsx       # client component: MapLibre map, markers, popups
    │   └── AdSlot.tsx       # ad placeholder
    └── lib/
        └── api.ts           # fetchStatus/fetchJets; server hits backend directly, client uses /api proxy
```

## Where New Files Go

- **New API route**: add a handler in `backend/src/routes.ts` (split into `routes/` only if it grows large). Update `route-map.md`.
- **New data provider**: implement `JetSource` in `backend/src/sources/<name>.ts`, swap the import in `poller/poll.ts`.
- **New DB table/column**: edit the schema in `backend/src/db.ts`. Update `schema-map.md`.
- **New business logic / aggregation**: `backend/src/services/`.
- **New page**: `frontend/src/app/<route>/page.tsx`. Update `route-map.md`.
- **New reusable component**: `frontend/src/components/`.
- **New client/server data fetch**: add to `frontend/src/lib/api.ts`.
