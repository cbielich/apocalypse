import { db } from '../db';
import { config } from '../config';
import { getLatestSnapshot } from '../poller/poll';

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
  samples: number;
  totalSamples: number;
  calibrating: boolean;
  basis: 'recent' | 'hour-of-week';
  updatedAt: number;
  message: string;
}

const DAY_MS = 86_400_000;

const totalStmt = db.prepare('SELECT COUNT(*) as n FROM counts');
const recentStmt = db.prepare('SELECT count FROM counts WHERE ts >= ?');
const bucketStmt = db.prepare(
  'SELECT count FROM counts WHERE ts >= ? AND hour_of_week = ?',
);
const globalStmt = db.prepare('SELECT count FROM counts');

function stats(values: number[]): { mean: number; std: number } {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return { mean, std: Math.sqrt(variance) };
}

const round1 = (x: number) => Math.round(x * 10) / 10;

const MESSAGES: Record<Level, string> = {
  CALIBRATING: 'Calibrating baseline — not enough history yet to detect anomalies.',
  'ALL CLEAR': 'Skies are normal. The elite are staying put.',
  STIRRING: 'Above-average private jet activity. Keep an eye on the sky.',
  'BUG OUT': 'Major surge in private jets aloft. Something has them moving.',
  APOCALYPSE: 'Extreme private-jet exodus. Draw your own conclusions.',
};

export function getStatus(): Status {
  const snap = getLatestSnapshot();
  const count = snap.count;
  const total = (totalStmt.get() as { n: number }).n;

  if (total < config.minSamplesCalibrated) {
    return {
      level: 'CALIBRATING',
      count,
      mean: null,
      std: null,
      samples: total,
      totalSamples: total,
      calibrating: true,
      basis: 'recent',
      updatedAt: snap.ts,
      message: MESSAGES.CALIBRATING,
    };
  }

  const now = Date.now();
  const d = new Date(now);
  const how = d.getUTCDay() * 24 + d.getUTCHours();

  // Default baseline: the recent rolling window (e.g. last 7 days). This tracks
  // the current overall level, so gradual drift doesn't read as an anomaly —
  // the count is judged "unusual vs. lately", not vs. one stale week-old sample.
  let basis: Status['basis'] = 'recent';
  let sample = (
    recentStmt.all(now - config.baselineWindowDays * DAY_MS) as { count: number }[]
  ).map((r) => r.count);

  // Once there are several weeks of history, prefer the time-of-day pattern,
  // computed over a longer window that still includes the most recent week.
  if (total >= config.bucketReadySamples) {
    const bucket = (
      bucketStmt.all(now - config.bucketWindowDays * DAY_MS, how) as {
        count: number;
      }[]
    ).map((r) => r.count);
    if (bucket.length >= config.minSamplesForBucket) {
      sample = bucket;
      basis = 'hour-of-week';
    }
  }

  // Safety net: never compute against an empty set.
  if (sample.length === 0) {
    sample = (globalStmt.all() as { count: number }[]).map((r) => r.count);
  }

  const { mean, std } = stats(sample);
  // Guard against a zero-variance baseline producing trigger-happy alerts.
  const spread = Math.max(std, 1);
  const t1 = mean + spread;
  const t2 = mean + spread * 2;
  const t3 = mean + spread * 3;

  let level: Level = 'ALL CLEAR';
  if (count > t3) level = 'APOCALYPSE';
  else if (count > t2) level = 'BUG OUT';
  else if (count > t1) level = 'STIRRING';

  return {
    level,
    count,
    mean: round1(mean),
    std: round1(std),
    samples: sample.length,
    totalSamples: total,
    calibrating: false,
    basis,
    updatedAt: snap.ts,
    message: MESSAGES[level],
  };
}
