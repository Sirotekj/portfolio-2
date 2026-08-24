export const locales = ['cs', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'cs';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
