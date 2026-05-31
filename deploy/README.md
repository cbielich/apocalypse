# Deploying Apocalypse Tracker on the shared EC2

This EC2 already runs:
- **host nginx** on ports 80/443 (system service, not a container), and
- a **Laravel Sail** stack (`freescrabbledictionary`) whose app container publishes to `127.0.0.1:8080`, which host nginx reverse-proxies.

So Apocalypse Tracker follows the **same pattern**: run its containers, publish the frontend to a localhost-only port, and add an nginx `server` block that proxies `apocalypsetracker.com` to it. The backend stays private on an internal Docker network.

```
Internet ─► host nginx :443 ─┬─ freescrabbledictionary.* ─► 127.0.0.1:8080 (existing)
                             └─ apocalypsetracker.com ────► 127.0.0.1:8090 ─► apocalypse-frontend:3000
                                                                                      │
                                                                          backend (internal only)
```

## Steps (run on the EC2)

```bash
# 1. Get the code
cd /home/ubuntu
git clone https://github.com/cbielich/apocalypse.git   # or: cd apocalypse && git pull
cd apocalypse

# 2. Configure secrets (AdSense ID, NASA key)
cp .env.example .env
nano .env            # set ADSENSE_CLIENT and NASA_API_KEY

# 3. Build + start (frontend on 127.0.0.1:8090, backend private)
./deploy.sh          # pulls, builds, restarts, health-checks

# 4. Confirm it's serving locally
curl -I http://127.0.0.1:8090            # expect HTTP 200

# 4. Add the nginx vhost and reload
sudo cp deploy/nginx/apocalypsetracker.conf /etc/nginx/sites-available/apocalypsetracker.conf
sudo ln -s /etc/nginx/sites-available/apocalypsetracker.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. DNS: point apocalypsetracker.com (A record) at this EC2's public/Elastic IP.
#    (Port 80/443 are already open since the other site works.)

# 6. TLS — once DNS resolves here:
sudo certbot --nginx -d apocalypsetracker.com
```

Verify: `curl -I https://apocalypsetracker.com` → 200, and
`docker compose -f deploy/docker-compose.prod.yml logs backend | grep '\[poll\]'`.

## Notes

- **Port 8090** is used because the Laravel app already holds 8080. Change it in
  both `deploy/docker-compose.prod.yml` and the nginx `proxy_pass` if needed.
- **Jet data** comes from **airplanes.live** (free, key-less, AWS-reachable).
  OpenSky was dropped because it blocks AWS datacenter IPs.
- **Secrets** live in `.env` (gitignored): `ADSENSE_CLIENT` (inlined into the
  frontend at build) and `NASA_API_KEY` (dashboard asteroid signal). `deploy.sh`
  loads `.env` automatically.
- **CORS** is locked to `https://apocalypsetracker.com` via `CORS_ORIGIN`.
- **Updates / redeploys**: just run **`./deploy.sh`** (git pull + build + restart
  + health check). Changing `ADSENSE_CLIENT` requires a rebuild — deploy.sh does that.
- The `jetdata` volume persists the SQLite history across restarts.

## Not needed for this EC2

`deploy/caddy/` provides a self-contained Caddy reverse proxy (with automatic
HTTPS) for a host that has **no** existing proxy. You already have host nginx, so
you don't need it — it's kept only for portability to other hosts.
