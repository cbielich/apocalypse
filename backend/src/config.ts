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
  // Baseline calibration thresholds.
  minSamplesForBucket: Number(process.env.MIN_SAMPLES_BUCKET || 5),
  minSamplesCalibrated: Number(process.env.MIN_SAMPLES_CALIBRATED || 24),
};
