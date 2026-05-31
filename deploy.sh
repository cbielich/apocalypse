#!/usr/bin/env bash
# Deploy Apocalypse Tracker (production) on the EC2.
# Usage:  ./deploy.sh
set -euo pipefail

cd "$(dirname "$0")" # repo root — this script lives here
COMPOSE="docker compose -f deploy/docker-compose.prod.yml"

# Load .env so ${ADSENSE_CLIENT} / ${NASA_API_KEY} reach docker compose.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
else
  echo "==> NOTE: no .env found — building without AdSense / NASA key."
fi

echo "==> Pulling latest from git..."
git pull --ff-only

echo "==> Building and (re)starting containers..."
$COMPOSE up -d --build

echo "==> Pruning dangling images..."
docker image prune -f >/dev/null || true

echo "==> Waiting for the frontend on 127.0.0.1:8090..."
ok=0
for _ in $(seq 1 30); do
  if curl -sf -o /dev/null http://127.0.0.1:8090/; then ok=1; break; fi
  sleep 2
done
if [ "$ok" = 1 ]; then echo "    frontend OK"; else echo "    WARNING: frontend not responding yet"; fi

echo "==> Recent backend logs:"
$COMPOSE logs --tail=6 backend | grep -E '\[poll\]|\[server\]|failed' || true

echo "==> Done -> https://apocalypsetracker.com"
