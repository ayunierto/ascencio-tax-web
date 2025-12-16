import 'server-only';

const dictionaries = {
  en: () =>
    import('../../dictionaries/en.json').then((module) => module.default),
  es: () =>
    import('../../dictionaries/es.json').then((module) => module.default),
};

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en';

export const getDictionary = async (locale: 'en' | 'es') =>
  dictionaries[locale]();

export type Dictionary = (typeof dictionaries)['en'] extends () => Promise<
  infer R
>
  ? R
  : never;
