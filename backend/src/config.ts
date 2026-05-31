import path from 'node:path';

export const config = {
  port: Number(process.env.PORT || 4000),
  dataDir: process.env.DATA_DIR || path.join(process.cwd(), 'data'),
  // How often to poll the data source. Default: every 5 minutes.
  pollCron: process.env.POLL_CRON || '*/5 * * * *',
  // OpenSky publishes a full aircraft registry CSV (icao24 -> typecode). We use
  // it to know which airborne aircraft are business jets.
  aircraftDbUrl:
    process.env.AIRCRAFT_DB_URL ||
    'https://opensky-network.org/datasets/metadata/aircraftDatabase.csv',
  opensky: {
    baseUrl: process.env.OPENSKY_BASE_URL || 'https://opensky-network.org/api',
    tokenUrl:
      process.env.OPENSKY_TOKEN_URL ||
      'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
    // Optional OAuth2 client credentials for higher rate limits. Anonymous works
    // but is heavily rate-limited.
    clientId: process.env.OPENSKY_CLIENT_ID || '',
    clientSecret: process.env.OPENSKY_CLIENT_SECRET || '',
    // Optional bounding box "lamin,lomin,lamax,lomax" to restrict to a region.
    bbox: process.env.OPENSKY_BBOX || '',
  },
  // Baseline calibration thresholds.
  minSamplesForBucket: Number(process.env.MIN_SAMPLES_BUCKET || 5),
  minSamplesCalibrated: Number(process.env.MIN_SAMPLES_CALIBRATED || 24),
};
