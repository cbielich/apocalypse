import type { Status } from '../lib/api';

const COLORS: Record<string, string> = {
  CALIBRATING: '#6b7280',
  'ALL CLEAR': '#22c55e',
  STIRRING: '#eab308',
  'BUG OUT': '#f97316',
  APOCALYPSE: '#ef4444',
};

export default function Indicator({ status }: { status: Status }) {
  const color = COLORS[status.level] || '#6b7280';
  return (
    <section className="indicator" style={{ borderColor: color }}>
      <div className="level" style={{ color }}>
        {status.level}
      </div>
      <div className="count">
        {status.count}
        <span> jets airborne</span>
      </div>
      {status.mean != null && (
        <div className="baseline">
          Typical right now: ~{status.mean} (±{status.std})
        </div>
      )}
      <p className="message">{status.message}</p>
      {status.calibrating && (
        <p className="hint">
          Baseline still calibrating — readings firm up after a few days of data.
        </p>
      )}
    </section>
  );
}
