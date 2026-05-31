import { ImageResponse } from 'next/og';
import { fetchStatus } from '../lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const alt = 'Apocalypse Tracker — live private-jet apocalypse indicator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COLORS: Record<string, string> = {
  CALIBRATING: '#6b7280',
  'ALL CLEAR': '#22c55e',
  STIRRING: '#eab308',
  'BUG OUT': '#f97316',
  APOCALYPSE: '#ef4444',
};

export default async function OgImage() {
  let level = 'CALIBRATING';
  let count = 0;
  try {
    const s = await fetchStatus();
    level = s.level;
    count = s.count;
  } catch {
    // fall back to defaults
  }
  const color = COLORS[level] || '#6b7280';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
          color: '#e7e7ef',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 44, letterSpacing: 4, color: '#8a8aa0' }}>
          ☢ APOCALYPSE TRACKER
        </div>
        <div style={{ fontSize: 150, fontWeight: 800, color, marginTop: 20 }}>
          {level}
        </div>
        <div style={{ fontSize: 52, marginTop: 10 }}>
          {`${count} business jets airborne`}
        </div>
      </div>
    ),
    { ...size },
  );
}
