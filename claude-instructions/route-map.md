# Route Map

> Authoritative reference for all routes (API + frontend). Update this file whenever a route is added, removed, or changed.

## API Routes

Backend: Fastify, base path `/api`. All responses use the `{ data }` envelope (see `api-response-format.md`).

| Method | Path | Handler | Auth | Notes |
|--------|------|---------|------|-------|
| GET | /api/health | `routes.ts` | no | Liveness check → `{ data: { ok: true } }` |
| GET | /api/status | `routes.ts` → `services/baseline.ts#getStatus` | no | Current level (CALIBRATING/NORMAL/ELEVATED/SPIKE), live count, baseline mean/std |
| GET | /api/jets | `routes.ts` → `poller/poll.ts#getLatestSnapshot` | no | Latest in-memory snapshot of airborne business jets |
| GET | /api/history?hours=N | `routes.ts` | no | Time series of counts; `hours` clamped to 1..720 (default 24) |
| GET | /api/breakdown | `routes.ts` | no | Live snapshot grouped by country and aircraft type (top 8 each) |
| GET | /api/records | `routes.ts` | no | All-time peak/low/avg/biggest-jump from `counts` |
| GET | /api/badge.svg | `routes.ts` | no | Embeddable SVG status badge (Content-Type image/svg+xml, cached 60s) |
| POST | /api/subscribe | `routes.ts` | no | Stores `{ email }` in `subscribers` (no email sending wired up yet) |

## Frontend Routes

Frontend: Next.js App Router. SSR (`dynamic = 'force-dynamic'`).

| Path | Component | Layout | Auth | Notes |
|------|-----------|--------|------|-------|
| / | `app/page.tsx` (Home) | `app/layout.tsx` | no | SSR indicator + live map + ad slots; `generateMetadata` reflects live status |
| /dashboard | `app/dashboard/page.tsx` ("Global Signals") | `app/layout.tsx` | no | SSR multi-signal board (jets, USGS quakes, NOAA Kp, CoinGecko BTC); each signal fetched server-side with fallback |
| /trends | `app/trends/page.tsx` + `TrendsChart`, `BreakdownPanel` (client) | `app/layout.tsx` | no | History charts (24h/7d/30d) + summary stats + live country/type breakdown |
| /records | `app/records/page.tsx` | `app/layout.tsx` | no | SSR all-time records from `/api/records` |
| /prepper | `app/prepper/page.tsx` | `app/layout.tsx` | no | Long-form prepper/bug-out article |
| /faq | `app/faq/page.tsx` | `app/layout.tsx` | no | Static methodology/FAQ |
| /embed | `app/embed/page.tsx` | `app/layout.tsx` | no | Badge preview + HTML/Markdown embed snippets |

### Generated / Metadata Routes

These are Next.js file-based metadata routes (no page component) used for SEO:

| Path | Source | Notes |
|------|--------|-------|
| /sitemap.xml | `app/sitemap.ts` | Lists all 7 frontend routes; home `priority 1`/`hourly`, others `0.7`/`weekly` |
| /robots.txt | `app/robots.ts` | Allows all crawlers, disallows `/api/`, points to `/sitemap.xml` |

Home also renders `SubscribeForm` (POSTs to `/api/subscribe`). `app/opengraph-image.tsx` generates the dynamic social share image reflecting the live status. JSON-LD structured data is emitted via `components/JsonLd.tsx` (WebSite/Organization in `layout.tsx`, WebApplication/Dataset on Home, FAQPage on `/faq`).

Shared `Nav` (`components/Nav.tsx`) is rendered in `app/layout.tsx` on every page.

Note: the browser calls `/api/*` on the frontend origin; the runtime proxy handler `app/api/[...path]/route.ts` forwards to the backend (`BACKEND_INTERNAL`). SSR code calls the backend directly via `lib/api.ts`.

## Conventions

_See `naming-conventions.md` for route naming rules._
