import type { Metadata } from 'next';
import { fetchStatus, type Status } from '../lib/api';
import Indicator from '../components/Indicator';
import JetMap from '../components/JetMap';
import AdSlot from '../components/AdSlot';
import SubscribeForm from '../components/SubscribeForm';
import ShareButtons from '../components/ShareButtons';

export const dynamic = 'force-dynamic';

const HOME_DESCRIPTION =
  'Track private & business jet activity worldwide in real time. A sudden spike in elite air travel may signal trouble — see the live apocalypse indicator, interactive map, and global doomsday signals.';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await fetchStatus();
    return {
      title: `${s.level} — Apocalypse Tracker`,
      description: HOME_DESCRIPTION,
    };
  } catch {
    return { description: HOME_DESCRIPTION };
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
      <header className="hero">
        <h1>APOCALYPSE TRACKER</h1>
        <p className="subtitle">
          Real-time private &amp; business jet apocalypse indicator
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
