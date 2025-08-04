import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth0 } from './lib/auth0';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Только для /auth/ — auth0
  if (pathname.startsWith('/auth/')) {
    return auth0.middleware(request);
  }

  // Для остальных — intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
