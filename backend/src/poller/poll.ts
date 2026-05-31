import { db } from '../db';
import { airplanesLiveSource } from '../sources/airplaneslive';
import type { Jet, JetSource } from '../sources/types';

// Swap this to a different JetSource implementation (ADS-B Exchange, FlightAware)
// to change providers — nothing else needs to change.
const source: JetSource = airplanesLiveSource;

export interface Snapshot {
  jets: Jet[];
  count: number;
  ts: number;
}

let latest: Snapshot = { jets: [], count: 0, ts: 0 };
export function getLatestSnapshot(): Snapshot {
  return latest;
}

const insertCount = db.prepare(
  'INSERT INTO counts (ts, count, hour_of_week) VALUES (?, ?, ?)',
);

function hourOfWeek(date: Date): number {
  return date.getUTCDay() * 24 + date.getUTCHours();
}

export async function runPoll(): Promise<void> {
  try {
    const jets = await source.fetchAirborneJets();
    const now = new Date();
    latest = { jets, count: jets.length, ts: now.getTime() };
    insertCount.run(now.getTime(), jets.length, hourOfWeek(now));
    console.log(
      `[poll] ${now.toISOString()} airborne business jets: ${jets.length} ` +
        `(source ${source.name})`,
    );
  } catch (err) {
    console.error('[poll] failed:', (err as Error).message);
  }
}
