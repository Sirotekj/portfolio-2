import { defaultLocale, type Locale } from './config';

/** Builds a locale-prefixed path, e.g. `/cs/o-mne`. */
export function localizedPath(locale: Locale, path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (normalized === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}

/** Strips the locale prefix from a pathname, e.g. `/cs/blog` → `/blog`. */
export function stripLocaleFromPathname(pathname: string): string {
  for (const locale of ['cs', 'en'] as const) {
    if (pathname === `/${locale}`) {
      return '/';
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }

  return pathname;
}

/** Reads the locale segment from a pathname, if present. */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];

  if (segment === 'cs' || segment === 'en') {
    return segment;
  }

  return null;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'cs' ? 'en' : 'cs';
}

export { defaultLocale };
