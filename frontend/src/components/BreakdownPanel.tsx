'use client';

import { useEffect, useState } from 'react';
import { fetchBreakdown, type Tally } from '../lib/api';

function BarList({ rows }: { rows: Tally[] }) {
  const max = rows.length ? Math.max(...rows.map((r) => r.count)) : 1;
  return (
    <div className="barlist">
      {rows.map((r) => (
        <div key={r.name} className="barlist-row">
          <span className="barlist-name" title={r.name}>
            {r.name}
          </span>
          <span className="barlist-track">
            <span
              className="barlist-fill"
              style={{ width: `${Math.max(4, (r.count / max) * 100)}%` }}
            />
          </span>
          <span className="barlist-count">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function BreakdownPanel() {
  const [byCountry, setByCountry] = useState<Tally[]>([]);
  const [byType, setByType] = useState<Tally[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchBreakdown()
      .then((d) => {
        if (!cancelled) {
          setByCountry(d.byCountry || []);
          setByType(d.byType || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="muted">Loading…</p>;
  if (!byCountry.length && !byType.length)
    return <p className="muted">No jets airborne to break down right now.</p>;

  return (
    <div className="breakdown-grid">
      <div>
        <h3 className="chart-title">Top countries airborne now</h3>
        <BarList rows={byCountry} />
      </div>
      <div>
        <h3 className="chart-title">Top aircraft types now</h3>
        <BarList rows={byType} />
      </div>
    </div>
  );
}
