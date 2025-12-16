import { NextRequest } from 'next/server';
import { locales, defaultLocale } from './dictionaries';

export function getLocale(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');

  if (!acceptLanguage) return defaultLocale;

  // Parse accept-language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [locale, q = '1'] = lang.trim().split(';q=');
      return { locale: locale.split('-')[0], quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first matching locale
  for (const { locale } of languages) {
    if (locales.includes(locale as any)) {
      return locale;
    }
  }

  return defaultLocale;
}
