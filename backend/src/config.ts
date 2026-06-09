import path from 'node:path';

export const config = {
  port: Number(process.env.PORT || 4000),
  dataDir: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  // Comma-separated allowed origins for CORS. Empty = allow any (dev default).
  corsOrigin: process.env.CORS_ORIGIN || '',
  // How often to poll the data source. Default: every 5 minutes.
  pollCron: process.env.POLL_CRON || '*/5 * * * *',
  // airplanes.live — free, key-less ADS-B API, reachable from AWS, and returns
  // aircraft type/model inline (so no separate registry is needed).
  airplanesLive: {
    baseUrl: process.env.AIRPLANES_LIVE_URL || 'https://api.airplanes.live/v2',
  },
  // Baseline calibration / adaptivity.
  minSamplesCalibrated: Number(process.env.MIN_SAMPLES_CALIBRATED || 24),
  // Rolling window (days) for the adaptive "recent" baseline — what the live
  // count is compared against by default. Adapts to drift in the overall level.
  baselineWindowDays: Number(process.env.BASELINE_WINDOW_DAYS || 7),
  // Longer window (days) for the time-of-day (hour-of-week) baseline, used only
  // once there's enough history; still includes the most recent week.
  bucketWindowDays: Number(process.env.BUCKET_WINDOW_DAYS || 28),
  // Min recent samples in an hour-of-week bucket before trusting it.
  minSamplesForBucket: Number(process.env.MIN_SAMPLES_BUCKET || 12),
  // Total samples (~3 weeks) before switching from recent to hour-of-week.
  bucketReadySamples: Number(process.env.BUCKET_READY_SAMPLES || 6000),
};
