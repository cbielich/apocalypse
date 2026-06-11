import type { Metadata } from 'next';
import { fetchStatus, type Status } from '../lib/api';
import Indicator from '../components/Indicator';
import JetMap from '../components/JetMap';
import AdSlot from '../components/AdSlot';
import SubscribeForm from '../components/SubscribeForm';
import ShareButtons from '../components/ShareButtons';
import JsonLd from '../components/JsonLd';

export const dynamic = 'force-dynamic';

const HOME_DESCRIPTION =
  'See how many private jets are in the air right now — live worldwide business-jet activity. A sudden spike in elite air travel may signal trouble. Live apocalypse indicator + interactive map.';

export async function generateMetadata(): Promise<Metadata> {
  const FALLBACK_TITLE =
    'Private Jets in the Air Right Now — Apocalypse Tracker';
  try {
    const s = await fetchStatus();
    return {
      title: `${s.level} — Private Jets in the Air Right Now | Apocalypse Tracker`,
      description: HOME_DESCRIPTION,
    };
  } catch {
    return { title: FALLBACK_TITLE, description: HOME_DESCRIPTION };
  }
}

export default async function Home() {
  let status: Status | null = null;
  try {
    status = await fetchStatus();
  } catch {
    status = null;
  }

  return (
    <main className="container">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Apocalypse Tracker',
            url: 'https://apocalypsetracker.com',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Any (web browser)',
            description: HOME_DESCRIPTION,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Live private & business jet activity count',
            description:
              'Real-time worldwide count of airborne private and business jets, updated continuously and compared against an hour-of-week baseline.',
            url: 'https://apocalypsetracker.com',
            creator: { '@type': 'Organization', name: 'Apocalypse Tracker' },
          },
        ]}
      />
      <header className="hero">
        <h1>APOCALYPSE TRACKER</h1>
        <p className="subtitle">
          Real-time private &amp; business jet apocalypse indicator — see how many
          private jets are in the air right now, worldwide
        </p>
      </header>

      <AdSlot id="top" />

      {status ? (
        <Indicator status={status} />
      ) : (
        <div className="indicator err">Signal offline. Stand by.</div>
      )}

      <ShareButtons />

      <section className="map-section">
        <h2>Live jets in the sky</h2>
        <JetMap />
      </section>

      <SubscribeForm />

      <AdSlot id="bottom" />

      <footer className="footer">
        <p>
          For entertainment. Data via OpenSky Network. Not financial, survival,
          or eschatological advice.
        </p>
      </footer>
    </main>
  );
}
