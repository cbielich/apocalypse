'use client';

import { useEffect, useState } from 'react';

type Point = { ts: number; count: number };

const RANGES = [
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
  { label: '30d', hours: 720 },
];

const LINE_TIP =
  'The number of business jets airborne worldwide, sampled at each poll (every 5 minutes) over the selected range. Watch for a sustained climb above the usual band.';
const HOUR_TIP =
  'Average jets airborne for each hour of the day (UTC), computed across the selected range. Reveals the daily rhythm — when private-jet traffic usually peaks.';

function InfoTip({ text }: { text: string }) {
  return (
    <span className="info inline" tabIndex={0} aria-label={text}>
      ⓘ
      <span className="tip" role="tooltip">
        {text}
      </span>
    </span>
  );
}

export default function TrendsChart() {
  const [hours, setHours] = useState(24);
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/history?hours=${hours}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) {
          setPoints((j.data as Point[]) || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hours]);

  const counts = points.map((p) => p.count);
  const min = counts.length ? Math.min(...counts) : 0;
  const max = counts.length ? Math.max(...counts) : 1;
  const avg = counts.length
    ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
    : 0;
  const now = counts.length ? counts[counts.length - 1] : 0;

  // Line chart geometry
  const W = 800;
  const H = 280;
  const PAD = 34;
  const span = max - min || 1;
  const t0 = points.length ? points[0].ts : 0;
  const t1 = points.length ? points[points.length - 1].ts : 1;
  const tspan = t1 - t0 || 1;
  const px = (ts: number) => PAD + ((ts - t0) / tspan) * (W - 2 * PAD);
  const py = (c: number) => H - PAD - ((c - min) / span) * (H - 2 * PAD);
  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.ts).toFixed(1)},${py(p.count).toFixed(1)}`)
    .join(' ');
  const area = points.length
    ? `${line} L${px(t1).toFixed(1)},${H - PAD} L${px(t0).toFixed(1)},${H - PAD} Z`
    : '';

  // Average by hour of day (UTC)
  const buckets = Array.from({ length: 24 }, () => ({ sum: 0, n: 0 }));
  for (const p of points) {
    const h = new Date(p.ts).getUTCHours();
    buckets[h].sum += p.count;
    buckets[h].n += 1;
  }
  const hourly = buckets.map((b) => (b.n ? b.sum / b.n : 0));
  const hMax = Math.max(1, ...hourly);
  const BW = 800;
  const BH = 220;
  const BP = 34;
  const barW = (BW - 2 * BP) / 24;

  const enough = points.length >= 2;

  return (
    <div>
      <div className="range-tabs">
        {RANGES.map((r) => (
          <button
            key={r.hours}
            className={`range-tab${hours === r.hours ? ' active' : ''}`}
            onClick={() => setHours(r.hours)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Loading…</p>
      ) : !enough ? (
        <p className="muted">
          Not enough data yet — the charts fill in as more polls accumulate.
        </p>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat">
              <span className="stat-label">Now</span>
              <span className="stat-value">{now}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Average</span>
              <span className="stat-value">{avg}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Peak</span>
              <span className="stat-value">{max}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Low</span>
              <span className="stat-value">{min}</span>
            </div>
          </div>

          <h3 className="chart-title">
            Jets airborne over time <InfoTip text={LINE_TIP} />
          </h3>
          <svg
            className="chart"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Business-jet activity over time"
          >
            <path d={area} fill="rgba(255,210,63,0.12)" />
            <path d={line} fill="none" stroke="#ffd23f" strokeWidth="2" />
            <text x={PAD} y={18} className="chart-label">
              {max} max
            </text>
            <text x={PAD} y={H - PAD + 20} className="chart-label">
              {min} min
            </text>
          </svg>

          <h3 className="chart-title">
            Average by hour of day (UTC) <InfoTip text={HOUR_TIP} />
          </h3>
          <svg
            className="chart"
            viewBox={`0 0 ${BW} ${BH}`}
            role="img"
            aria-label="Average jets airborne by hour of day"
          >
            {hourly.map((v, i) => {
              const h = (v / hMax) * (BH - 2 * BP);
              return (
                <rect
                  key={i}
                  x={(BP + i * barW + 1).toFixed(1)}
                  y={(BH - BP - h).toFixed(1)}
                  width={(barW - 2).toFixed(1)}
                  height={h.toFixed(1)}
                  fill="#ffd23f"
                  opacity={0.85}
                />
              );
            })}
            {[0, 6, 12, 18].map((h) => (
              <text
                key={h}
                x={(BP + h * barW).toFixed(1)}
                y={BH - BP + 16}
                className="chart-label"
              >
                {h}:00
              </text>
            ))}
          </svg>
        </>
      )}
      <p className="muted small">Airborne business jets, sampled at each poll.</p>
    </div>
  );
}
