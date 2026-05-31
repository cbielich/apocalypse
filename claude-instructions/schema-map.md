# Schema Map

> Authoritative reference for database tables, columns, and relationships. Update this file whenever a migration adds, removes, or changes a table or column.

Database: **SQLite** (`better-sqlite3`), file at `${DATA_DIR}/apocalypse.db` (WAL mode). Schema is created idempotently in `backend/src/db.ts` (no migration tool yet).

## Tables

#### `counts`
- **Purpose**: one row per poll — the number of airborne business jets at a moment in time. This is the history the baseline/anomaly detection is computed from.
- **Columns**:
  - `id` — INTEGER PRIMARY KEY AUTOINCREMENT
  - `ts` — INTEGER, epoch milliseconds of the poll
  - `count` — INTEGER, airborne business-jet count at `ts`
  - `hour_of_week` — INTEGER 0..167, `UTCDay()*24 + UTCHours()`; baseline bucket key
- **Relationships**: none (standalone time series)
- **Indexes**:
  - `idx_counts_how` on `(hour_of_week)` — baseline lookup by bucket
  - `idx_counts_ts` on `(ts)` — history range queries
- **Notes**: written by `poller/poll.ts`; read by `services/baseline.ts` and the `/api/history` route. The live jet snapshot is **not** persisted — it is kept in memory in `poller/poll.ts` and repopulated on the next poll after a restart.

#### `subscribers`
- **Purpose**: email signups for "notify me when the indicator hits RED". Capture only — no email sending is wired up yet.
- **Columns**:
  - `id` — INTEGER PRIMARY KEY AUTOINCREMENT
  - `email` — TEXT NOT NULL UNIQUE (stored lowercased; `INSERT OR IGNORE` on duplicates)
  - `created_at` — INTEGER, epoch milliseconds
- **Relationships**: none
- **Notes**: written by `POST /api/subscribe` (validated with a basic email regex).

## Relationship Diagram

_Standalone tables (`counts`, `subscribers`); no relationships yet._

## Conventions

_See `naming-conventions.md` for column/table naming rules._
