import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectLocale } from './lib/i18n/detect-locale';
import { locales } from './lib/i18n/locales';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore internal resources and API without language prefix
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets')
  ) {
    return NextResponse.next();
  }

  // Check if the path already has a language prefix
  const hasLocalePrefix = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocalePrefix) {
    const header = request.headers.get('accept-language') || undefined;
    const locale = detectLocale(header);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Apply to everything except internal resources
  matcher: ['/((?!_next|api|favicon|assets).*)'],
};
