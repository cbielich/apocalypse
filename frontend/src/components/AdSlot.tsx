// Placeholder ad slot. To monetize, set NEXT_PUBLIC_ADSENSE_CLIENT and replace
// this with a Google AdSense <ins className="adsbygoogle"> unit (load the
// AdSense script in app/layout.tsx). Kept as a labeled box for now so the
// layout reserves space and looks intentional.
export default function AdSlot({ id }: { id: string }) {
  return (
    <div className="ad-slot" data-slot={id}>
      <span>Advertisement</span>
    </div>
  );
}
