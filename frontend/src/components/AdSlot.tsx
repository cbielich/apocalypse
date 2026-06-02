'use client';

import { useEffect, useRef } from 'react';

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-9360752375665568';
// Default display ad-unit slot ID (data-ad-slot). Set ADSENSE_SLOT in .env.
// A per-placement slot can be passed via the `slot` prop to override it.
const DEFAULT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({ id, slot }: { id: string; slot?: string }) {
  const adSlot = slot || DEFAULT_SLOT;
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !adSlot || pushed.current) return;
    try {
      // Queueing {} tells AdSense to fill this <ins>. Safe even before the
      // adsbygoogle script loads — it processes the queue on load.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // not ready yet; ignore
    }
  }, [adSlot]);

  // No ad unit configured (or ads off) → reserved placeholder so the layout
  // doesn't shift once ads turn on. Also what shows before AdSense approval.
  if (!CLIENT || !adSlot) {
    return (
      <div className="ad-slot" data-slot={id}>
        <span>Advertisement</span>
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle ad-unit"
      style={{ display: 'block' }}
      data-ad-client={CLIENT}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
