import { NextRequest, NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionTokenEdge,
} from '@/lib/auth/session-edge';
import { defaultLocale, isValidLocale, locales } from '@/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

function shouldSkipLocaleRedirect(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/edit') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/edit')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthenticated = token
      ? await verifyAdminSessionTokenEdge(token)
      : false;

    if (!isAuthenticated) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin';
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (shouldSkipLocaleRedirect(pathname)) {
    return NextResponse.next();
  }

  const pathnameLocale = pathname.split('/')[1];
  const hasLocalePrefix = isValidLocale(pathnameLocale);

  if (!hasLocalePrefix) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-next-locale', pathnameLocale);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

export { locales };
