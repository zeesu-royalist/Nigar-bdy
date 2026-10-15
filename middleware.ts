import { NextResponse } from 'next/server';

export async function middleware(req: any) {
  const check = await fetch('https://rate-limiter-gateway-y5ff.onrender.com/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.RATE_LIMITER_API_KEY,
      ip: req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1',
      path: req.nextUrl.pathname
    })
  });

  if (check.status === 429) {
    return new Response(JSON.stringify({ error: 'Too Many Requests' }), { 
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}