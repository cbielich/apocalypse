import type { Metadata } from 'next';
import AdSlot from '../../components/AdSlot';

export const metadata: Metadata = {
  title: 'The Prepper Guide — Apocalypse Tracker',
  description:
    'A practical, in-depth preparedness guide: water, food, power, shelter, first aid, documents, the bug-out bag, and how to decide between leaving and staying put.',
};

export default function PrepperPage() {
  return (
    <main className="container">
      <header className="page-head">
        <h1>The Prepper Guide</h1>
        <p className="subtitle">
          When the jet meter goes red, the prepared don&apos;t scramble. This is
          the long version — everything that actually matters, in order.
        </p>
      </header>
      <AdSlot id="prepper-top" />

      <article className="panel content">
        <p className="lead">
          Preparedness isn&apos;t about bunkers and doomsday fantasies. It&apos;s
          about boring, practical resilience: having enough water, food, warmth,
          and information to ride out 72 hours without outside help — the window
          that covers the overwhelming majority of real emergencies, from a
          regional blackout to a hurricane to the kind of disruption that quietly
          fills the skies with private jets. Build for three days first. Everything
          beyond that is an extension of the same fundamentals.
        </p>
        <p>
          The single biggest predictor of how you&apos;ll fare in a crisis
          isn&apos;t the gear you own — it&apos;s whether you&apos;ve thought it
          through before it happens. Read this once, make a list, and spend a
          couple of weekends closing the gaps. That&apos;s the whole game.
        </p>

        <h2>1. Water — the non-negotiable</h2>
        <p>
          You can survive weeks without food but only about three days without
          water, and dehydration degrades your judgment long before it threatens
          your life. Plan for <strong>one gallon (about 4 liters) per person per
          day</strong>: roughly half for drinking and half for cooking and basic
          hygiene. For a family of four over three days, that&apos;s twelve
          gallons — more than most people realize, which is exactly why it&apos;s
          the first thing to sort out.
        </p>
        <h3>Storage</h3>
        <ul>
          <li>Commercial bottled water is the simplest store-and-forget option; rotate it every year or two.</li>
          <li>Food-grade containers (7-gallon jugs, stackable water bricks) for larger reserves.</li>
          <li>Keep some water in a portable container you can actually carry if you have to leave.</li>
        </ul>
        <h3>Purification — three methods, learn all of them</h3>
        <ul>
          <li><strong>Boiling</strong> — a rolling boil for one minute (three at altitude) kills pathogens. Foolproof if you have a heat source.</li>
          <li><strong>Filtration</strong> — a hollow-fiber filter (e.g. squeeze or pump style) removes bacteria and protozoa and lets you use found water.</li>
          <li><strong>Chemical</strong> — unscented household bleach (8 drops per gallon, wait 30 min) or purification tablets as a compact backup.</li>
        </ul>

        <h2>2. Food — calories without the kitchen</h2>
        <p>
          During a disruption you may have no power, no gas, and no time. Build
          your food reserve around items that need <em>zero preparation</em> and
          survive on a shelf for years. Aim for at least <strong>2,000 calories
          per person per day</strong>, and favor calorie density over variety —
          comfort matters, but calories keep you functioning.
        </p>
        <ul>
          <li>Energy and protein bars, peanut butter, nuts, trail mix.</li>
          <li>Canned protein (tuna, chicken, beans) and canned vegetables/fruit.</li>
          <li>Crackers, dried fruit, jerky, shelf-stable meals.</li>
          <li>A manual can opener — the most-forgotten item on every list.</li>
        </ul>
        <p>
          Buy what your household actually eats, then rotate it into normal meals
          and replace it. A reserve you cycle through is one that&apos;s always
          fresh; a reserve you forget about is one you discover is expired the day
          you need it.
        </p>

        <h2>3. Power, light &amp; communication</h2>
        <p>
          When the grid goes down, information and light become the difference
          between calm and panic. None of this requires a generator to start.
        </p>
        <ul>
          <li><strong>Headlamp</strong> plus spare batteries for every person — hands-free beats a flashlight every time.</li>
          <li><strong>Power banks</strong>, kept charged, plus a hand-crank or solar charger for the long tail of an outage.</li>
          <li>A <strong>battery or hand-crank radio</strong> with NOAA weather bands — when the cell network is congested or down, broadcast radio still works.</li>
          <li>Keep your vehicle&apos;s tank above half; a car is also a phone charger and a warm shelter.</li>
        </ul>

        <h2>4. Shelter, warmth &amp; clothing</h2>
        <p>
          Exposure kills faster than hunger. The goal is to stay dry and trap heat,
          whether you&apos;re sheltering at home without heating or moving on foot.
        </p>
        <ul>
          <li>Emergency mylar blankets and a compact tarp or bivvy.</li>
          <li>Layered clothing (base, insulating, waterproof shell) and a dry change of socks — wet feet are a real hazard.</li>
          <li>Fire: a lighter, waterproof matches, and a ferro rod as backup.</li>
          <li>Work gloves and sturdy, broken-in shoes you can walk miles in.</li>
        </ul>

        <h2>5. Health &amp; first aid</h2>
        <p>
          A crisis is the worst time to discover your first-aid kit is a box of
          mismatched band-aids. Build or buy a real one, and just as importantly,
          know how to use it.
        </p>
        <ul>
          <li>Trauma basics: pressure dressings, gauze, medical tape, a tourniquet, antiseptic.</li>
          <li>Everyday meds: pain relievers, anti-diarrheal, antihistamine, electrolyte packets.</li>
          <li><strong>Prescriptions</strong>: keep at least a two-week supply rotated; refill early when you can.</li>
          <li>Glasses/contacts spares, and copies of prescriptions.</li>
          <li>Take a basic first-aid/CPR course. Skills weigh nothing.</li>
        </ul>

        <h2>6. Documents, cash &amp; information</h2>
        <p>
          When systems fail, paper and small bills still work. Card readers
          don&apos;t work in a blackout, and your phone&apos;s photo of your
          insurance card is useless once the battery dies.
        </p>
        <ul>
          <li>Copies (physical and on an encrypted USB) of ID, passports, insurance, deeds, and medical info.</li>
          <li>Cash in small denominations — enough for fuel, food, and a few nights somewhere.</li>
          <li>A printed contact list and a chosen out-of-area relative everyone checks in with.</li>
          <li>Paper maps of your region with at least two evacuation routes marked.</li>
        </ul>

        <h2>7. The go-bag (bug-out bag)</h2>
        <p>
          The go-bag is a single pack, staged by the door, that gets you through
          the first 72 hours if you have to leave in minutes. One per adult, scaled
          down for kids. It&apos;s a condensed version of everything above:
        </p>
        <ul>
          <li>Water (2–3 liters) plus a filter and tablets.</li>
          <li>No-cook food for three days.</li>
          <li>Headlamp, power bank, weather radio.</li>
          <li>Mylar blanket, rain shell, hat, gloves, spare socks.</li>
          <li>Compact first-aid kit and any critical meds.</li>
          <li>Multi-tool, duct tape, paracord, lighter.</li>
          <li>Documents pouch and cash.</li>
          <li>Phone charging cable, a paper map, pen and notebook.</li>
        </ul>

        <h2>8. Bug out, or shelter in place?</h2>
        <p>
          The instinct to flee isn&apos;t always right. <strong>Sheltering in
          place</strong> is usually safer when the hazard is outside (chemical
          release, severe weather, civil disruption) and your home is intact — you
          have your full supplies and four walls. <strong>Bugging out</strong>
          makes sense when staying is the danger: fire, flood, structural damage,
          or an official evacuation order. Decide the triggers in advance, watch
          official channels, and if you leave, leave <em>early</em> — the roads are
          empty before everyone else reaches the same conclusion.
        </p>

        <h2>9. Make a plan (this is the real prep)</h2>
        <p>
          Gear is the easy part. The thing that actually saves families is a
          shared, rehearsed plan:
        </p>
        <ul>
          <li>Where do you meet if you can&apos;t get home or reach each other?</li>
          <li>Who is the out-of-area contact everyone calls?</li>
          <li>Who grabs the kids, the pets, the go-bags, the meds?</li>
          <li>What are your two evacuation routes, and where do they lead?</li>
        </ul>
        <p>
          Write it down. Walk through it once. Update it when life changes. A plan
          on paper beats a perfect kit and a blank stare every single time.
        </p>

        <h2>10. Mindset &amp; skills</h2>
        <p>
          Calm is a resource you can train. People who do well in emergencies have
          usually decided, ahead of time, that they will stay deliberate and
          methodical when others panic. Pair that with a few learned skills — first
          aid, basic navigation, how to shut off your home&apos;s water and gas,
          how to cook without power — and you&apos;ve built the one thing no gear
          can provide: competence. Start small, build the habit, and check back on
          the meter now and then.
        </p>
      </article>

      <AdSlot id="prepper-bottom" />
      <footer className="footer">
        <p>
          General preparedness information, not professional, medical, or legal
          advice. Adapt to your own situation and follow official local guidance.
        </p>
      </footer>
    </main>
  );
}
