export const locales = ['en', 'es'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export const isSupportedLocale = (lang: string): lang is Locale =>
  locales.includes(lang as Locale);
