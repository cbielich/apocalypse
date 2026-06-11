import type { Metadata } from 'next';
import AdSlot from '../../components/AdSlot';
import JsonLd from '../../components/JsonLd';

export const metadata: Metadata = {
  title: 'FAQ & Methodology — How the Apocalypse Indicator Works',
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
  {
    q: 'How many private jets are in the air right now?',
    a: 'The live count is shown on the home page and updates continuously as new ADS-B data comes in. At any given moment there are typically several hundred to a few thousand business jets airborne worldwide, depending on the hour and day of the week.',
  },
  {
    q: 'What does it mean when private-jet activity spikes?',
    a: 'Usually nothing dramatic — spikes line up with holidays, major sporting events, big conferences (think Davos or large finance gatherings), and weather systems rerouting flights. The indicator simply flags when activity is unusually high for that hour of the week; interpreting why is up to you.',
  },
  {
    q: 'Are billionaires or the elite "fleeing" when the indicator turns red?',
    a: 'No — a red reading means business-jet traffic is statistically elevated, not that anyone is escaping anything. It is an entertainment lens on real flight data, not evidence of insider knowledge. Treat a spike as a conversation starter, not a warning.',
  },
  {
    q: 'Can private-jet traffic predict a disaster or market crash?',
    a: 'There is no proven predictive link, and we make no such claim. The tracker is a novelty built on real public data — a fun way to notice patterns in how the wealthy travel, not a forecasting tool.',
  },
  {
    q: 'What is the Apocalypse Index?',
    a: 'It is a single 0–100 score on the dashboard that combines many real-world feeds — earthquakes, solar storms, volcanoes, near-Earth asteroids, severe weather, markets, and jet activity — into one number. Higher means more of those signals are simultaneously elevated.',
  },
  {
    q: 'Which aircraft count as "private" or "business" jets?',
    a: 'We match airborne aircraft against a registry of known business-jet types — Gulfstreams, Bombardier Globals and Challengers, Cessna Citations, Dassault Falcons, Embraer Legacy/Praetor, and similar. Airliners, props, and military aircraft are excluded.',
  },
  {
    q: 'How often does the tracker update?',
    a: 'The jet count is polled continuously and reflects near-real-time positions. The other dashboard signals (earthquakes, space weather, markets) refresh on their own provider schedules, generally every couple of minutes.',
  },
  {
    q: 'Do you track my location or personal data?',
    a: 'No. The site shows aggregate aircraft data only — it does not request, store, or track anything about you. There is no account and no login.',
  },
  {
    q: 'Can I put the indicator on my own website?',
    a: 'Yes. The Embed page provides a lightweight status badge plus ready-to-paste HTML and Markdown snippets you can drop into a site, blog, or README.',
  },
];

export default function FaqPage() {
  return (
    <main className="container">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: QA.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }}
      />
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
