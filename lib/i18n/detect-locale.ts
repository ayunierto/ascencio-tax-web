import { defaultLocale, locales, Locale } from './locales';

export function detectLocale(acceptLanguageHeader?: string): Locale {
  if (!acceptLanguageHeader) return defaultLocale;

  const candidates = acceptLanguageHeader
    .split(',')
    .map((item) => item.split(';')[0].trim().toLowerCase());

  for (const cand of candidates) {
    // match exact 'en'/'es' or normalize 'en-US' -> 'en'
    const short = cand.split('-')[0];
    if ((locales as readonly string[]).includes(cand)) return cand as Locale;
    if ((locales as readonly string[]).includes(short)) return short as Locale;
  }
  return defaultLocale;
}
