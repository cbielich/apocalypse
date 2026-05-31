import type { Metadata } from 'next';
import AdSlot from '../../components/AdSlot';

export const metadata: Metadata = {
  title: 'FAQ & Methodology — Apocalypse Tracker',
  description:
    'How the Apocalypse Tracker indicator works: data sources, what counts as a business jet, and how the alert levels are calculated.',
};

const QA = [
  {
    q: 'What does this site actually measure?',
    a: 'The number of private/business jets airborne worldwide right now, compared to what is normal for this hour of the week. An unusual spike is the "signal".',
  },
  {
    q: 'Where does the flight data come from?',
    a: 'Live ADS-B broadcasts via the OpenSky Network. Aircraft are matched against a registry of known business-jet types (Gulfstreams, Globals, Citations, Falcons, and similar).',
  },
  {
    q: 'How are the alert levels decided?',
    a: 'We learn a baseline for each hour of the week from historical counts (mean and standard deviation). ALL CLEAR is normal; STIRRING is roughly 1+ standard deviation above; BUG OUT is 2+; APOCALYPSE is 3+. CALIBRATING shows until enough history exists.',
  },
  {
    q: 'Why does it say CALIBRATING?',
    a: 'The baseline needs data to be meaningful. Until enough samples accumulate (the first hours after launch), the indicator stays in CALIBRATING and won’t raise false alarms.',
  },
  {
    q: 'Is this a serious prediction tool?',
    a: 'No. It is entertainment built on real public data. A spike in jets can mean a holiday, a big sporting event, or a major conference — not necessarily the end of the world.',
  },
];

export default function FaqPage() {
  return (
    <main className="container">
      <header className="page-head">
        <h1>FAQ &amp; Methodology</h1>
        <p className="subtitle">How the indicator works, in plain terms.</p>
      </header>
      <AdSlot id="faq-top" />

      <section className="panel content">
        {QA.map((item) => (
          <div key={item.q} className="qa">
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </div>
        ))}
      </section>

      <AdSlot id="faq-bottom" />
      <footer className="footer">
        <p>For entertainment. Not financial, survival, or eschatological advice.</p>
      </footer>
    </main>
  );
}
