import type { Metadata } from 'next';
import TrendsChart from '../../components/TrendsChart';
import BreakdownPanel from '../../components/BreakdownPanel';
import AdSlot from '../../components/AdSlot';

export const metadata: Metadata = { title: 'Trends — Apocalypse Tracker' };

export default function TrendsPage() {
  return (
    <main className="container">
      <header className="page-head">
        <h1>Activity Trends</h1>
        <p className="subtitle">
          Business-jet activity over time. A steady climb is worth watching.
        </p>
      </header>
      <AdSlot id="trends-top" />
      <section className="panel">
        <TrendsChart />
      </section>
      <section className="panel">
        <BreakdownPanel />
      </section>
      <AdSlot id="trends-bottom" />
    </main>
  );
}
