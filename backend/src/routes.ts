import type { FastifyInstance } from 'fastify';
import { getStatus } from './services/baseline';
import { getLatestSnapshot } from './poller/poll';
import { db } from './db';

const historyStmt = db.prepare(
  'SELECT ts, count FROM counts WHERE ts >= ? ORDER BY ts ASC',
);
const peakStmt = db.prepare('SELECT count, ts FROM counts ORDER BY count DESC, ts ASC LIMIT 1');
const lowStmt = db.prepare(
  'SELECT count, ts FROM counts WHERE count > 0 ORDER BY count ASC, ts ASC LIMIT 1',
);
const aggStmt = db.prepare('SELECT COUNT(*) as n, AVG(count) as avg FROM counts');
const jumpStmt = db.prepare(
  `SELECT MAX(count - prev) as jump FROM (
     SELECT count, LAG(count) OVER (ORDER BY ts) AS prev FROM counts
   )`,
);
const insertSub = db.prepare(
  'INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)',
);

const LEVEL_COLORS: Record<string, string> = {
  CALIBRATING: '#6b7280',
  'ALL CLEAR': '#22c55e',
  STIRRING: '#eab308',
  'BUG OUT': '#f97316',
  APOCALYPSE: '#ef4444',
};

function topCounts(values: (string | null)[], limit: number): { name: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const v of values) {
    const key = (v || 'Unknown').trim() || 'Unknown';
    tally.set(key, (tally.get(key) || 0) + 1);
  }
  return [...tally.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;',
  );
}

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/health', async () => ({ data: { ok: true } }));

  app.get('/api/status', async () => ({ data: getStatus() }));

  app.get('/api/jets', async () => {
    const snap = getLatestSnapshot();
    return { data: { count: snap.count, updatedAt: snap.ts, jets: snap.jets } };
  });

  app.get('/api/history', async (req) => {
    const raw = Number((req.query as { hours?: string }).hours);
    const hours = Math.min(Number.isFinite(raw) && raw > 0 ? raw : 24, 24 * 30);
    const since = Date.now() - hours * 3_600_000;
    const rows = historyStmt.all(since) as { ts: number; count: number }[];
    return { data: rows };
  });

  // Live breakdown of the current snapshot by country and aircraft type.
  app.get('/api/breakdown', async () => {
    const snap = getLatestSnapshot();
    const byCountry = topCounts(
      snap.jets.map((j) => j.originCountry),
      8,
    );
    const byType = topCounts(
      snap.jets.map((j) => j.model || j.type),
      8,
    );
    return { data: { count: snap.count, updatedAt: snap.ts, byCountry, byType } };
  });

  // All-time records derived from the counts history.
  app.get('/api/records', async () => {
    const peak = peakStmt.get() as { count: number; ts: number } | undefined;
    const low = lowStmt.get() as { count: number; ts: number } | undefined;
    const agg = aggStmt.get() as { n: number; avg: number | null };
    const jump = jumpStmt.get() as { jump: number | null };
    return {
      data: {
        peak: peak ?? null,
        low: low ?? null,
        avg: agg.avg != null ? Math.round(agg.avg) : null,
        totalPolls: agg.n,
        biggestJump: jump.jump ?? null,
      },
    };
  });

  // Embeddable status badge (SVG).
  app.get('/api/badge.svg', async (_req, reply) => {
    const s = getStatus();
    const color = LEVEL_COLORS[s.level] || '#6b7280';
    const label = 'APOCALYPSE TRACKER';
    const value = escapeXml(`${s.level} · ${s.count}`);
    const labelW = 200;
    const valueW = Math.max(110, value.length * 8 + 24);
    const w = labelW + valueW;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="32" role="img" aria-label="${label}: ${value}">
  <rect width="${w}" height="32" rx="6" fill="#0a0a0f"/>
  <rect x="${labelW}" width="${valueW}" height="32" rx="6" fill="${color}"/>
  <rect x="${labelW}" width="8" height="32" fill="${color}"/>
  <g font-family="Verdana,Geneva,sans-serif" font-size="12" font-weight="bold">
    <text x="12" y="21" fill="#e7e7ef">☢ ${label}</text>
    <text x="${labelW + 12}" y="21" fill="#0a0a0f">${value}</text>
  </g>
</svg>`;
    reply
      .header('Content-Type', 'image/svg+xml; charset=utf-8')
      .header('Cache-Control', 'public, max-age=60')
      .send(svg);
  });

  // Email capture for "notify when RED" (stored only; no sending wired up yet).
  app.post('/api/subscribe', async (req, reply) => {
    const email = String((req.body as { email?: string })?.email || '')
      .trim()
      .toLowerCase();
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!valid) {
      reply.status(400).send({ error: { message: 'Please enter a valid email address.' } });
      return;
    }
    insertSub.run(email, Date.now());
    return { data: { ok: true } };
  });
}
