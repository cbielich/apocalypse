import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embed the Badge — Apocalypse Tracker',
  description:
    'Add a live Apocalypse Tracker status badge to your own site with a single line of HTML.',
};

const SITE = 'https://apocalypsetracker.com';
const badgeUrl = `${SITE}/api/badge.svg`;
const htmlSnippet = `<a href="${SITE}"><img src="${badgeUrl}" alt="Apocalypse Tracker status" /></a>`;
const mdSnippet = `[![Apocalypse Tracker status](${badgeUrl})](${SITE})`;

export default function EmbedPage() {
  return (
    <main className="container">
      <header className="page-head">
        <h1>Embed the Badge</h1>
        <p className="subtitle">
          Drop a live status badge on your blog, README, or dashboard. It updates
          itself.
        </p>
      </header>

      <section className="panel content">
        <h2>Live preview</h2>
        {/* Uses the relative proxy path so it renders on localhost too. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/badge.svg" alt="Apocalypse Tracker status badge" />

        <h2>HTML</h2>
        <pre className="snippet">{htmlSnippet}</pre>

        <h2>Markdown</h2>
        <pre className="snippet">{mdSnippet}</pre>

        <p className="muted small">
          The badge is cached for ~60 seconds. Replace the domain above once the
          site is live at its public URL.
        </p>
      </section>
    </main>
  );
}
