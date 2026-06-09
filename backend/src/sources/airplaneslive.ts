import { config } from '../config';
import { BUSINESS_JET_TYPES } from '../jets/types';
import type { Jet, JetSource } from './types';

interface RawAc {
  hex?: string;
  flight?: string;
  r?: string; // registration / tail number
  t?: string; // ICAO type designator
  desc?: string; // human model name
  lat?: number;
  lon?: number;
  alt_baro?: number | 'ground';
  alt_geom?: number;
  gs?: number; // ground speed, knots
  track?: number;
  true_heading?: number;
}

const HEADERS = { 'User-Agent': 'apocalypsetracker.com (+https://apocalypsetracker.com)' };
const FT_TO_M = 0.3048;
const KT_TO_MS = 0.514444;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Rough country from registration (tail number) prefix. Business jets are
// mostly N-registered (US), with common offshore/European marks covered here.
// Longer/more-specific prefixes are listed before shorter ones.
const REG_PREFIXES: [string, string][] = [
  ['9H', 'Malta'], ['VP-', 'Br. Overseas'], ['VQ-', 'Br. Overseas'], ['T7', 'San Marino'],
  ['P4', 'Aruba'], ['A6', 'UAE'], ['A7', 'Qatar'], ['HZ', 'Saudi Arabia'], ['VT', 'India'],
  ['JA', 'Japan'], ['XA', 'Mexico'], ['CS', 'Portugal'], ['EC', 'Spain'], ['PH', 'Netherlands'],
  ['OE', 'Austria'], ['HB', 'Switzerland'], ['LX', 'Luxembourg'], ['OO', 'Belgium'],
  ['SE', 'Sweden'], ['LN', 'Norway'], ['OY', 'Denmark'], ['EI', 'Ireland'], ['VH', 'Australia'],
  ['C-', 'Canada'], ['G-', 'United Kingdom'], ['D-', 'Germany'], ['F-', 'France'],
  ['I-', 'Italy'], ['M-', 'Isle of Man'], ['B-', 'China'], ['N', 'United States'],
];

function countryFromReg(reg: string | undefined): string | null {
  if (!reg) return null;
  const r = reg.trim().toUpperCase();
  if (!r) return null;
  for (const [prefix, country] of REG_PREFIXES) {
    if (r.startsWith(prefix)) return country;
  }
  return 'Other';
}

async function fetchType(type: string): Promise<Jet[]> {
  const res = await fetch(`${config.airplanesLive.baseUrl}/type/${type}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`airplaneslive ${type} ${res.status}`);
  const data = (await res.json()) as { ac?: RawAc[] };
  const out: Jet[] = [];
  for (const a of data.ac ?? []) {
    if (a.alt_baro === 'ground') continue; // skip parked/taxiing
    if (a.lat == null || a.lon == null) continue;
    const hex = String(a.hex || '').toLowerCase();
    if (!hex) continue;
    const altFt =
      typeof a.alt_baro === 'number'
        ? a.alt_baro
        : typeof a.alt_geom === 'number'
          ? a.alt_geom
          : null;
    out.push({
      icao24: hex,
      callsign: (a.flight || a.r || '').trim() || null,
      lat: a.lat,
      lon: a.lon,
      altitude: altFt != null ? altFt * FT_TO_M : null,
      heading: a.track ?? a.true_heading ?? null,
      velocity: a.gs != null ? a.gs * KT_TO_MS : null,
      originCountry: countryFromReg(a.r),
      type: a.t || type,
      model: a.desc || null,
    });
  }
  return out;
}

export const airplanesLiveSource: JetSource = {
  name: 'airplanes.live',
  async fetchAirborneJets() {
    const types = [...BUSINESS_JET_TYPES];
    const seen = new Set<string>();
    const jets: Jet[] = [];
    let failed = 0;
    // Sequential with a delay — airplanes.live rate-limits bursts (429), which
    // would silently drop most aircraft types. ~1 req/s keeps every type.
    for (const t of types) {
      try {
        for (const j of await fetchType(t)) {
          if (seen.has(j.icao24)) continue; // an aircraft can match only one type, but guard anyway
          seen.add(j.icao24);
          jets.push(j);
        }
      } catch {
        failed++;
      }
      await sleep(config.airplanesLive.requestDelayMs);
    }
    if (failed) {
      console.warn(`[airplanes.live] ${failed}/${types.length} type queries failed`);
    }
    return jets;
  },
};
