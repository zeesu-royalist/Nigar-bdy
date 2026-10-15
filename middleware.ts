import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const apiKey = process.env.RATE_LIMITER_API_KEY;

  if (!apiKey) {
    return NextResponse.next();
  }

  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  try {
    const check = await fetch('https://rate-limiter-gateway-y5ff.onrender.com/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        ip,
        path: req.nextUrl.pathname
      })
    });

    if (check.status === 429) {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Rate limiter check failed:', error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};