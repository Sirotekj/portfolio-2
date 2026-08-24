'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import {
  getAlternateLocale,
  localizedPath,
  stripLocaleFromPathname,
} from '@/i18n/routing';

type NavigationProps = {
  locale: Locale;
};

export default function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname();
  const messages = getMessages(locale);
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  const alternateLocale = getAlternateLocale(locale);

  const navItems = [
    { href: localizedPath(locale, '/'), label: messages.nav.portfolio },
    { href: localizedPath(locale, '/o-mne'), label: messages.nav.about },
    { href: localizedPath(locale, '/blog'), label: messages.nav.blog },
  ];

  return (
    <nav className="flex items-center gap-1">
      {navItems.map(({ href, label }) => {
        const isActive =
          href === localizedPath(locale, '/')
            ? pathWithoutLocale === '/'
            : pathWithoutLocale === stripLocaleFromPathname(href) ||
              pathWithoutLocale.startsWith(`${stripLocaleFromPathname(href)}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 text-xl font-medium transition-colors ${
              isActive ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            {label}
          </Link>
        );
      })}

      <Link
        href={localizedPath(alternateLocale, pathWithoutLocale)}
        className="ml-2 pl-3 py-2 text-xl font-medium text-foreground transition-colors hover:text-primary"
        aria-label={`Switch to ${alternateLocale.toUpperCase()}`}
      >
        {messages.localeSwitch}
      </Link>
    </nav>
  );
}
