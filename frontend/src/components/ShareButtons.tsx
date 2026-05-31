'use client';

import { useState } from 'react';

const SHARE_TEXT =
  'Is the apocalypse coming? Apocalypse Tracker watches private-jet activity worldwide in real time. 🛩️🔥';
const FALLBACK_URL = 'https://apocalypsetracker.com';

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  function pageUrl() {
    return typeof window !== 'undefined' ? window.location.href : FALLBACK_URL;
  }

  function open(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=520');
  }

  const u = () => encodeURIComponent(pageUrl());
  const t = () => encodeURIComponent(SHARE_TEXT);

  async function copy() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; ignore
    }
  }

  return (
    <section className="share">
      <span className="share-label">Spread the word</span>
      <div className="share-btns">
        <button
          className="share-btn"
          onClick={() => open(`https://twitter.com/intent/tweet?text=${t()}&url=${u()}`)}
        >
          Post on X
        </button>
        <button
          className="share-btn"
          onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${u()}`)}
        >
          Facebook
        </button>
        <button
          className="share-btn"
          onClick={() => open(`https://www.reddit.com/submit?url=${u()}&title=${t()}`)}
        >
          Reddit
        </button>
        <button
          className="share-btn"
          onClick={() => open(`https://wa.me/?text=${t()}%20${u()}`)}
        >
          WhatsApp
        </button>
        <button className="share-btn copy" onClick={copy}>
          {copied ? '✓ Copied' : 'Copy link'}
        </button>
      </div>
    </section>
  );
}
