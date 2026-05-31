import { NextRequest } from 'next/server';

// Runtime proxy to the backend. Reads BACKEND_INTERNAL per-request so the
// destination is configurable at deploy time (unlike next.config.js rewrites,
// which are frozen at build time). SSR code in lib/api.ts calls the backend
// directly; this handler only serves browser-side fetches.
export const dynamic = 'force-dynamic';

async function proxy(req: NextRequest, path: string[]) {
  const backend = process.env.BACKEND_INTERNAL || 'http://localhost:4000';
  const url = `${backend}/api/${path.join('/')}${req.nextUrl.search}`;
  const init: RequestInit = { method: req.method, cache: 'no-store' };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
    init.headers = {
      'content-type': req.headers.get('content-type') || 'application/json',
    };
  }
  const res = await fetch(url, init);
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
