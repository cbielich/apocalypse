// On the server we call the backend directly; in the browser we use a relative
// path that next.config.js rewrites to the backend.
const SERVER_BASE = process.env.BACKEND_INTERNAL || 'http://localhost:4000';

function base(): string {
  return typeof window === 'undefined' ? SERVER_BASE : '';
}

export type Level =
  | 'CALIBRATING'
  | 'ALL CLEAR'
  | 'STIRRING'
  | 'BUG OUT'
  | 'APOCALYPSE';

export interface Status {
  level: Level;
  count: number;
  mean: number | null;
  std: number | null;
  calibrating: boolean;
  updatedAt: number;
  message: string;
}

export interface Jet {
  icao24: string;
  callsign: string | null;
  lat: number;
  lon: number;
  heading: number | null;
  altitude: number | null;
  type: string | null;
  model: string | null;
}

export async function fetchStatus(): Promise<Status> {
  const res = await fetch(`${base()}/api/status`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return (await res.json()).data as Status;
}

export async function fetchJets(): Promise<{
  count: number;
  updatedAt: number;
  jets: Jet[];
}> {
  const res = await fetch(`${base()}/api/jets`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`jets ${res.status}`);
  return (await res.json()).data;
}

export interface Tally {
  name: string;
  count: number;
}

export async function fetchBreakdown(): Promise<{
  count: number;
  byCountry: Tally[];
  byType: Tally[];
}> {
  const res = await fetch(`${base()}/api/breakdown`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`breakdown ${res.status}`);
  return (await res.json()).data;
}

export interface Records {
  peak: { count: number; ts: number } | null;
  low: { count: number; ts: number } | null;
  avg: number | null;
  totalPolls: number;
  biggestJump: number | null;
}

export async function fetchRecords(): Promise<Records> {
  const res = await fetch(`${base()}/api/records`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`records ${res.status}`);
  return (await res.json()).data;
}
