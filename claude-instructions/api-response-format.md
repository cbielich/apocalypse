# API Response Format

> Standard response envelope, error shapes, and pagination conventions. Update this file when the response format changes.

Backend: Fastify (`backend/src/routes.ts`). Every endpoint wraps its payload in a `data` envelope; errors use an `error` envelope (`backend/src/index.ts` error handler).

## Success Responses

### Single Resource

```json
{ "data": { "level": "NORMAL", "count": 933, "mean": 910.2, "std": 41.3 } }
```

The payload shape is endpoint-specific; it is always under the top-level `data` key.

### Collection

No pagination yet. Collections are returned as an array (or an object containing an array) under `data`:

```json
{ "data": { "count": 933, "updatedAt": 1780249202144, "jets": [ /* ... */ ] } }
```

`/api/history` returns a bare array under `data`:

```json
{ "data": [ { "ts": 1780249202144, "count": 933 } ] }
```

### Action-Only (no data returned)

Health check style:

```json
{ "data": { "ok": true } }
```

## Error Responses

All errors share one shape (set by `app.setErrorHandler`):

```json
{ "error": { "message": "..." } }
```

| Case | HTTP status | Notes |
|------|-------------|-------|
| Validation Error | 400 | `error.message` describes the problem; no field-level breakdown yet |
| Not Found | 404 | Fastify default for unknown routes |
| Authentication | n/a | No auth on the API yet |
| Authorization | n/a | No auth on the API yet |
| Server Error | 500 | Unhandled errors; `error.message` is the thrown message |

## Date Format

Timestamps in payloads are **epoch milliseconds** (integers), e.g. `updatedAt`, `ts`. Log lines use ISO 8601 UTC. (If human-readable timestamps are added to responses later, use ISO 8601 UTC.)

## Patterns

- **Envelope always**: `{ data }` on success, `{ error: { message } }` on failure.
- **No pagination** implemented; `/api/history` bounds results by a `hours` query param (clamped 1..720, default 24) rather than offset/limit.
- **Live snapshot vs. history**: `/api/jets` serves an in-memory snapshot (not DB-backed); `/api/history` and baseline reads come from the `counts` table.
- **CORS**: open (`origin: true`) — the browser normally reaches the API through the frontend proxy route instead.
