import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';

// Path publik tanpa prefiks locale dialihkan ke locale default (ADR-006).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Lewati api, admin, aset Next, dan berkas dengan ekstensi (favicon.ico, robots.txt, sitemap.xml).
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
};
