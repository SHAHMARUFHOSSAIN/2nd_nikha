import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, isAdmin } from '@/lib/auth';

const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/payment/sslcommerz/success',
  '/api/payment/sslcommerz/fail',
  '/api/payment/sslcommerz/cancel',
  '/api/payment/sslcommerz/ipn',
  '/api/payment/paystation',
  '/api/members',
];

const ADMIN_API_PREFIXES = ['/api/settings', '/api/articles', '/api/banners'];

const PUBLIC_PAGE_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

function matchesPublic(method: string, pathname: string): boolean {
  if (pathname === '/api/members' && method === 'GET') return true;

  return PUBLIC_PATHS.some(
    (p) =>
      pathname === p ||
      pathname.startsWith(p + '/')
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  const securityHeaders: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  };

  const session = await getSessionFromRequest(req);

  // ---- API routes protection ----
  if (pathname.startsWith('/api/')) {
    // SSLCommerz callbacks only accept POST from gateway (allow both for callback flexibility)
    if (pathname.startsWith('/api/payment/sslcommerz/')) {
      const response = NextResponse.next();
      Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    // Public API paths stay open
    if (matchesPublic(method, pathname)) {
      const response = NextResponse.next();
      Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    // Admin-only APIs
    const isAdminPath = ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p));
    if (isAdminPath) {
      if (!session || !isAdmin(session)) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Admin access required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Authenticated APIs (members POST/DELETE, auth me/logout, etc.)
      if (!session) {
        return new NextResponse(
          JSON.stringify({ success: false, error: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // ---- Admin page protection ----
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    if (!session || !isAdmin(session)) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---- Member-only pages stay open at middleware level; components guard the rest ----
  if (PUBLIC_PAGE_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};