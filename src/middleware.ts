import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth0 } from './lib/auth0';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/auth/')) {
    return await auth0.middleware(request);
  }

  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/:path*',
    '/auth/:path*', // Добавляем Auth0 маршруты
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
