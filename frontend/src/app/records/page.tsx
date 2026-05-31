import type { Metadata } from 'next';
import AdSlot from '../../components/AdSlot';
import { fetchRecords, type Records } from '../../lib/api';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Records — Apocalypse Tracker',
  description:
    'All-time records for global business-jet activity: the busiest moment, biggest surge, and long-run average.',
};

function fmtDate(ts: number): string {
  return new Date(ts).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
}

export default async function RecordsPage() {
  let r: Records | null = null;
  try {
    r = await fetchRecords();
  } catch {
    r = null;
  }

  const cards = r
    ? [
        {
          label: 'All-time peak',
          value: r.peak ? String(r.peak.count) : '—',
          sub: r.peak ? fmtDate(r.peak.ts) : 'no data yet',
        },
        {
          label: 'Biggest surge',
          value: r.biggestJump != null ? `+${r.biggestJump}` : '—',
          sub: 'jets, poll-to-poll',
        },
        {
          label: 'Long-run average',
          value: r.avg != null ? String(r.avg) : '—',
          sub: 'across all polls',
        },
        {
          label: 'Quietest moment',
          value: r.low ? String(r.low.count) : '—',
          sub: r.low ? fmtDate(r.low.ts) : 'no data yet',
        },
        {
          label: 'Total readings',
          value: r.totalPolls ? r.totalPolls.toLocaleString() : '0',
          sub: 'polls recorded',
        },
      ]
    : [];

  return (
    <main className="container">
      <header className="page-head">
        <h1>Records</h1>
        <p className="subtitle">
          The high-water marks of global private-jet activity since tracking began.
        </p>
      </header>
      <AdSlot id="records-top" />

      {r ? (
        <section className="card-grid">
          {cards.map((c) => (
            <div key={c.label} className="signal-card">
              <div className="signal-title">{c.label}</div>
              <div className="signal-value" style={{ color: '#ffd23f' }}>
                {c.value}
              </div>
              <div className="signal-sub">{c.sub}</div>
            </div>
          ))}
        </section>
      ) : (
        <p className="muted">Records unavailable right now.</p>
      )}

      <AdSlot id="records-bottom" />
      <footer className="footer">
        <p>Records build up over time as more polls accumulate.</p>
      </footer>
    </main>
  );
}
