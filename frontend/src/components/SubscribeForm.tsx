'use client';

import { useState, type FormEvent } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState('sending');
    setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error?.message || 'Something went wrong.');
      }
      setState('done');
    } catch (err) {
      setState('error');
      setMsg((err as Error).message);
    }
  }

  if (state === 'done') {
    return (
      <section className="subscribe">
        <p className="subscribe-done">
          ✓ You&apos;re on the list. We&apos;ll alert you when the skies turn red.
        </p>
      </section>
    );
  }

  return (
    <section className="subscribe">
      <h2>Get the red alert</h2>
      <p className="muted small">
        One email when the indicator hits BUG OUT or APOCALYPSE. No spam.
      </p>
      <form className="subscribe-form" onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Joining…' : 'Notify me'}
        </button>
      </form>
      {state === 'error' && <p className="subscribe-err">{msg}</p>}
    </section>
  );
}
