'use client';

import Link from 'next/link';
import { useState } from 'react';

const LINKS = [
  { href: '/', label: 'Jet Tracker' },
  { href: '/dashboard', label: 'Global Signals' },
  { href: '/trends', label: 'Trends' },
  { href: '/records', label: 'Records' },
  { href: '/prepper', label: 'Prepper Guide' },
  { href: '/faq', label: 'FAQ' },
  { href: '/embed', label: 'Embed' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand" onClick={close}>
        ☢ APOCALYPSE TRACKER
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>
      <div className={`nav-links${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="nav-link" onClick={close}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
