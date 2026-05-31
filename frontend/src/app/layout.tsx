import type { Metadata, Viewport } from 'next';
import Nav from '../components/Nav';
import './globals.css';

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
      </body>
    </html>
  );
}
