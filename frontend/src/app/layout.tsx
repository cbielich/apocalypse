import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import Nav from '../components/Nav';
import './globals.css';

// Google AdSense publisher ID (e.g. "ca-pub-...."). Set via ADSENSE_CLIENT in
// .env -> passed as the NEXT_PUBLIC_ADSENSE_CLIENT build arg. Empty = ads off.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';

export const metadata: Metadata = {
  metadataBase: new URL('https://apocalypsetracker.com'),
  title: 'Apocalypse Tracker — Private Jet Apocalypse Indicator',
  description:
    'Apocalypse Tracker watches private & business jet activity in real time. When the elite take to the skies all at once, you’ll know first.',
  openGraph: {
    title: 'Apocalypse Tracker',
    description: 'Real-time private & business jet apocalypse indicator.',
    url: 'https://apocalypsetracker.com',
    siteName: 'Apocalypse Tracker',
  },
  // AdSense site-verification meta tag.
  other: ADSENSE_CLIENT ? { 'google-adsense-account': ADSENSE_CLIENT } : {},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        {ADSENSE_CLIENT && (
          <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
