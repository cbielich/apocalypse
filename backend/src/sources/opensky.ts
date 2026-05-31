import { config } from '../config';
import type { Jet, JetSource } from './types';

let token: { value: string; exp: number } | null = null;

async function getToken(): Promise<string | null> {
  const { clientId, clientSecret, tokenUrl } = config.opensky;
  if (!clientId || !clientSecret) return null;
  if (token && Date.now() < token.exp - 30_000) return token.value;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    console.error('[opensky] token request failed:', res.status);
    return null;
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return token.value;
}

// OpenSky /states/all returns a fixed-position array per aircraft.
const I_ICAO = 0;
const I_CALLSIGN = 1;
const I_COUNTRY = 2;
const I_LON = 5;
const I_LAT = 6;
const I_BARO_ALT = 7;
const I_ON_GROUND = 8;
const I_VELOCITY = 9;
const I_TRACK = 10;
const I_GEO_ALT = 13;

export const openSkySource: JetSource = {
  name: 'opensky',
  async fetchAirborneJets(jetIcaos) {
    let url = `${config.opensky.baseUrl}/states/all`;
    if (config.opensky.bbox) {
      const [lamin, lomin, lamax, lomax] = config.opensky.bbox.split(',');
      url += `?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    }

    const headers: Record<string, string> = {};
    const tok = await getToken();
    if (tok) headers['Authorization'] = `Bearer ${tok}`;

    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`opensky states ${res.status}`);
    const data = (await res.json()) as { states: unknown[][] | null };

    const out: Jet[] = [];
    for (const s of data.states ?? []) {
      const icao = (s[I_ICAO] as string)?.toLowerCase();
      const onGround = s[I_ON_GROUND] as boolean;
      const lon = s[I_LON] as number | null;
      const lat = s[I_LAT] as number | null;
      if (!icao || onGround || lat == null || lon == null) continue;
      if (!jetIcaos.has(icao)) continue;
      out.push({
        icao24: icao,
        callsign: (s[I_CALLSIGN] as string)?.trim() || null,
        lat,
        lon,
        altitude: (s[I_GEO_ALT] ?? s[I_BARO_ALT]) as number | null,
        heading: s[I_TRACK] as number | null,
        velocity: s[I_VELOCITY] as number | null,
        originCountry: (s[I_COUNTRY] as string) || null,
        type: null,
        model: null,
      });
    }
    return out;
  },
};
