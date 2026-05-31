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
  updatedAt: number;
  message: string;
}

const totalStmt = db.prepare('SELECT COUNT(*) as n FROM counts');
const bucketStmt = db.prepare('SELECT count FROM counts WHERE hour_of_week = ?');
const globalStmt = db.prepare('SELECT count FROM counts');

function stats(values: number[]): { mean: number; std: number } {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return { mean, std: Math.sqrt(variance) };
}

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
      updatedAt: snap.ts,
      message: MESSAGES.CALIBRATING,
    };
  }

  const now = new Date();
  const how = now.getUTCDay() * 24 + now.getUTCHours();
  let sample = (bucketStmt.all(how) as { count: number }[]).map((r) => r.count);
  if (sample.length < config.minSamplesForBucket) {
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
    mean: Math.round(mean * 10) / 10,
    std: Math.round(std * 10) / 10,
    samples: sample.length,
    totalSamples: total,
    calibrating: false,
    updatedAt: snap.ts,
    message: MESSAGES[level],
  };
}
