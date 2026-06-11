import type { Metadata } from 'next';
import TrendsChart from '../../components/TrendsChart';
import BreakdownPanel from '../../components/BreakdownPanel';
import AdSlot from '../../components/AdSlot';

export const metadata: Metadata = {
  title: 'Private Jet Activity Trends & History | Apocalypse Tracker',
  description:
    'Private jet activity over time — 24-hour, 7-day, and 30-day history of worldwide business-jet traffic, plus live country and aircraft-type breakdowns.',
};

export default function TrendsPage() {
  return (
    <main className="container">
      <header className="page-head">
        <h1>Private Jet Activity Trends</h1>
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
