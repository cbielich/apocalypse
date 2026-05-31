# Apocalypse Tracker 🛩️🔥

> [apocalypsetracker.com](https://apocalypsetracker.com)

Real-time private & business jet apocalypse indicator. When an unusual number of
business jets (Gulfstreams, Globals, Citations, Falcons…) are airborne at once,
the meter goes red — *"are the elite leaving?"*

## How it works

- **Backend** (Fastify + SQLite) polls a flight-data source on a schedule, filters
  airborne aircraft down to known business-jet types, logs the count, and learns a
  per-hour-of-week **baseline**. A spike above the baseline flips the indicator
  from `NORMAL` → `ELEVATED` → `SPIKE`.
- **Frontend** (Next.js, SSR) shows the big status indicator, a live MapLibre map
  of the jets in the air, and ad slots.

The data source lives behind a swappable adapter (`backend/src/sources/`). It
ships with **OpenSky Network** (free). To move to **ADS-B Exchange** or
**FlightAware** later, implement the `JetSource` interface and change one import
in `backend/src/poller/poll.ts`.

## Run it

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/status

> **First run:** the backend downloads the OpenSky aircraft registry (~tens of MB)
> to build the business-jet list, then polls every 5 minutes. The indicator shows
> `CALIBRATING` until ~24 samples exist (a couple of hours), and the baseline gets
> meaningful after a few days of history.

## Configuration (env in `docker-compose.yml`)

| Var | Default | Purpose |
|-----|---------|---------|
| `POLL_CRON` | `*/5 * * * *` | Polling schedule |
| `OPENSKY_CLIENT_ID` / `OPENSKY_CLIENT_SECRET` | — | Optional OAuth2 creds for higher OpenSky rate limits |
| `OPENSKY_BBOX` | — | Restrict to a region: `lamin,lomin,lamax,lomax` |
| `MIN_SAMPLES_CALIBRATED` | `24` | Samples before leaving CALIBRATING |

## API

All responses are enveloped as `{ "data": ... }` (errors as `{ "error": { "message" } }`).

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/status` | Current level, count, baseline mean/std |
| GET | `/api/jets` | Latest snapshot of airborne business jets |
| GET | `/api/history?hours=24` | Time series of counts |
| GET | `/api/health` | `{ ok: true }` |

## Monetization

`frontend/src/components/AdSlot.tsx` is a placeholder. Set
`NEXT_PUBLIC_ADSENSE_CLIENT` and replace it with a Google AdSense unit (load the
AdSense script in `app/layout.tsx`).

## Notes

- Tracking is based on public ADS-B broadcasts. OpenSky's **free tier is
  non-commercial**; for an ad-supported production site, move to a provider whose
  terms permit commercial use (ADS-B Exchange / FlightAware).
- For entertainment. Not financial, survival, or eschatological advice.
