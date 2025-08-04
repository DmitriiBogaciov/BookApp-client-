import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth0 } from './lib/auth0';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/')) {
    try {
      const result = await auth0.middleware(request);
      return result;
    } catch (err) {
      return new Response('Auth0 middleware error', { status: 500 });
    }
  }

  try {
    const result = intlMiddleware(request);
    return result;
  } catch (err) {
    return new Response('intlMiddleware error', { status: 500 });
  }
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
