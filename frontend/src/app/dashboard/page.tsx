import type { Metadata } from 'next';
import AdSlot from '../../components/AdSlot';
import { fetchStatus } from '../../lib/api';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Global Signals — Apocalypse Tracker',
  description:
    'A live board of global signals: private-jet activity, earthquakes, solar storms, and markets.',
};

type SigLevel = 'calm' | 'watch' | 'alert' | 'unknown';
type Sig = { title: string; value: string; sub: string; level: SigLevel; tip: string };

const COLORS: Record<SigLevel, string> = {
  calm: '#22c55e',
  watch: '#eab308',
  alert: '#ef4444',
  unknown: '#6b7280',
};

const TIP_JETS =
  'Private/business jets airborne worldwide right now, compared with what is normal for this hour of the week. An unusual spike may mean the wealthy are on the move.';
const TIP_QUAKES =
  'Significant earthquakes (magnitude 4.5+) in the last 24 hours, plus the largest magnitude recorded. Source: USGS.';
const TIP_SPACE =
  'The planetary K-index (Kp) measures geomagnetic activity from solar storms, on a 0–9 scale. Kp 5+ indicates a storm that can disrupt power grids, GPS, and radio. Source: NOAA SWPC.';
const TIP_BTC =
  'Bitcoin’s current price and its 24-hour change. A sharp drop can signal market panic. Source: CoinGecko.';
const TIP_FNG =
  'The Crypto Fear & Greed Index (0–100). Low values mean investors are fearful — a proxy for broad market anxiety. Source: alternative.me.';
const TIP_FLARE =
  'The strongest current solar X-ray flare class (A/B/C/M/X). M and X flares can disrupt radio and satellites. Source: NOAA GOES.';
const TIP_WEATHER =
  'Count of active EXTREME-severity weather alerts in the US right now (e.g. tornado emergencies, major hurricanes). Source: US National Weather Service.';
const TIP_ASTEROID =
  'Near-Earth asteroids making a close approach today, and how many are flagged "potentially hazardous." Source: NASA NeoWs.';
const TIP_TSUNAMI =
  'Active tsunami warnings issued by the US National Weather Service. Source: NWS.';

async function getJson(url: string, headers?: Record<string, string>): Promise<unknown> {
  // Cache external signals for 120s so traffic can't trip provider rate limits
  // (CoinGecko's free tier in particular). The jet signal is our own backend
  // and stays live (no-store via lib/api).
  const res = await fetch(url, {
    next: { revalidate: 120 },
    signal: AbortSignal.timeout(5000),
    headers,
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

// NWS asks API clients to send a descriptive User-Agent.
const NWS_HEADERS = { 'User-Agent': 'apocalypsetracker.com (contact@apocalypsetracker.com)' };

async function jetSignal(): Promise<Sig> {
  try {
    const s = await fetchStatus();
    const level: SigLevel = s.calibrating
      ? 'unknown'
      : s.level === 'APOCALYPSE' || s.level === 'BUG OUT'
        ? 'alert'
        : s.level === 'STIRRING'
          ? 'watch'
          : 'calm';
    return {
      title: 'Private Jet Exodus',
      value: s.level,
      sub: `${s.count} jets airborne`,
      level,
      tip: TIP_JETS,
    };
  } catch {
    return { title: 'Private Jet Exodus', value: '—', sub: 'tracker unavailable', level: 'unknown', tip: TIP_JETS };
  }
}

async function quakes(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    )) as { features: { properties: { mag: number | null } }[] };
    const mags = j.features.map((f) => f.properties.mag).filter((m): m is number => m != null);
    const big = mags.filter((m) => m >= 4.5).length;
    const max = mags.length ? Math.max(...mags) : 0;
    const level: SigLevel = max >= 7 ? 'alert' : big >= 15 ? 'watch' : 'calm';
    return {
      title: 'Earthquakes (24h)',
      value: `${big} ≥ M4.5`,
      sub: `Largest: M${max.toFixed(1)}`,
      level,
      tip: TIP_QUAKES,
    };
  } catch {
    return { title: 'Earthquakes (24h)', value: '—', sub: 'USGS unavailable', level: 'unknown', tip: TIP_QUAKES };
  }
}

async function spaceWeather(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
    )) as { Kp: number }[];
    const last = j[j.length - 1];
    const kp = Number(last.Kp);
    const level: SigLevel = kp >= 7 ? 'alert' : kp >= 5 ? 'watch' : 'calm';
    return {
      title: 'Geomagnetic Storm',
      value: `Kp ${kp.toFixed(0)}`,
      sub: kp >= 5 ? 'Storm conditions' : 'Quiet',
      level,
      tip: TIP_SPACE,
    };
  } catch {
    return { title: 'Geomagnetic Storm', value: '—', sub: 'NOAA unavailable', level: 'unknown', tip: TIP_SPACE };
  }
}

async function bitcoin(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
    )) as { bitcoin: { usd: number; usd_24h_change: number } };
    const price = j.bitcoin.usd;
    const chg = j.bitcoin.usd_24h_change;
    const level: SigLevel = chg <= -10 ? 'alert' : chg <= -5 ? 'watch' : 'calm';
    return {
      title: 'Bitcoin (24h)',
      value: `$${Math.round(price).toLocaleString()}`,
      sub: `${chg >= 0 ? '+' : ''}${chg.toFixed(1)}% 24h`,
      level,
      tip: TIP_BTC,
    };
  } catch {
    return { title: 'Bitcoin (24h)', value: '—', sub: 'CoinGecko unavailable', level: 'unknown', tip: TIP_BTC };
  }
}

async function fearGreed(): Promise<Sig> {
  try {
    const j = (await getJson('https://api.alternative.me/fng/')) as {
      data: { value: string; value_classification: string }[];
    };
    const v = Number(j.data[0].value);
    const level: SigLevel = v <= 25 ? 'alert' : v <= 45 ? 'watch' : 'calm';
    return {
      title: 'Fear & Greed',
      value: String(v),
      sub: j.data[0].value_classification,
      level,
      tip: TIP_FNG,
    };
  } catch {
    return { title: 'Fear & Greed', value: '—', sub: 'index unavailable', level: 'unknown', tip: TIP_FNG };
  }
}

async function solarFlare(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json',
    )) as { current_class: string | null; max_class: string | null }[];
    const cls = j[0]?.max_class || j[0]?.current_class || 'A0';
    const letter = cls.charAt(0).toUpperCase();
    const level: SigLevel = letter === 'X' ? 'alert' : letter === 'M' ? 'watch' : 'calm';
    return {
      title: 'Solar Flare',
      value: cls,
      sub: letter === 'X' || letter === 'M' ? 'Strong flare' : 'Quiet sun',
      level,
      tip: TIP_FLARE,
    };
  } catch {
    return { title: 'Solar Flare', value: '—', sub: 'NOAA unavailable', level: 'unknown', tip: TIP_FLARE };
  }
}

async function severeWeather(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://api.weather.gov/alerts/active?status=actual&severity=Extreme',
      NWS_HEADERS,
    )) as { features: unknown[] };
    const n = j.features.length;
    const level: SigLevel = n >= 5 ? 'alert' : n >= 1 ? 'watch' : 'calm';
    return {
      title: 'Severe Weather (US)',
      value: String(n),
      sub: n === 1 ? '1 extreme alert' : `${n} extreme alerts`,
      level,
      tip: TIP_WEATHER,
    };
  } catch {
    return { title: 'Severe Weather (US)', value: '—', sub: 'NWS unavailable', level: 'unknown', tip: TIP_WEATHER };
  }
}

async function asteroids(): Promise<Sig> {
  try {
    const key = process.env.NASA_API_KEY || 'DEMO_KEY';
    const j = (await getJson(
      `https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false&api_key=${key}`,
    )) as {
      element_count: number;
      near_earth_objects: Record<string, { is_potentially_hazardous_asteroid: boolean }[]>;
    };
    const all = Object.values(j.near_earth_objects).flat();
    const hazardous = all.filter((a) => a.is_potentially_hazardous_asteroid).length;
    const level: SigLevel = hazardous >= 3 ? 'alert' : hazardous >= 1 ? 'watch' : 'calm';
    return {
      title: 'Near-Earth Asteroids',
      value: String(j.element_count),
      sub: `${hazardous} potentially hazardous`,
      level,
      tip: TIP_ASTEROID,
    };
  } catch {
    return { title: 'Near-Earth Asteroids', value: '—', sub: 'NASA unavailable', level: 'unknown', tip: TIP_ASTEROID };
  }
}

async function tsunami(): Promise<Sig> {
  try {
    const j = (await getJson(
      'https://api.weather.gov/alerts/active?event=Tsunami%20Warning',
      NWS_HEADERS,
    )) as { features: unknown[] };
    const n = j.features.length;
    const level: SigLevel = n >= 1 ? 'alert' : 'calm';
    return {
      title: 'Tsunami Warnings',
      value: String(n),
      sub: n === 0 ? 'None active' : `${n} active`,
      level,
      tip: TIP_TSUNAMI,
    };
  } catch {
    return { title: 'Tsunami Warnings', value: '—', sub: 'NWS unavailable', level: 'unknown', tip: TIP_TSUNAMI };
  }
}

export default async function DashboardPage() {
  const results = await Promise.allSettled<Sig>([
    jetSignal(),
    quakes(),
    spaceWeather(),
    solarFlare(),
    severeWeather(),
    tsunami(),
    asteroids(),
    fearGreed(),
    bitcoin(),
  ]);
  const signals: Sig[] = results.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : { title: 'Signal', value: '—', sub: 'unavailable', level: 'unknown', tip: '' },
  );

  return (
    <main className="container">
      <header className="page-head">
        <h1>Global Signals</h1>
        <p className="subtitle">
          A board of signals worth watching. Green is good. Red is… less good.
        </p>
      </header>
      <AdSlot id="dash-top" />
      <section className="card-grid">
        {signals.map((s, i) => (
          <div key={i} className="signal-card" style={{ borderColor: COLORS[s.level] }}>
            {s.tip && (
              <span className="info" tabIndex={0} aria-label={s.tip}>
                ⓘ
                <span className="tip" role="tooltip">
                  {s.tip}
                </span>
              </span>
            )}
            <div className="signal-title">{s.title}</div>
            <div className="signal-value" style={{ color: COLORS[s.level] }}>
              {s.value}
            </div>
            <div className="signal-sub">{s.sub}</div>
          </div>
        ))}
      </section>
      <AdSlot id="dash-bottom" />
      <footer className="footer">
        <p>
          Signals from USGS, NOAA SWPC, US NWS, NASA, CoinGecko, and
          alternative.me. For entertainment — not survival advice.
        </p>
      </footer>
    </main>
  );
}
