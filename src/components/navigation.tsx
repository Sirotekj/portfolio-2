'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import NavigationMobile from './navigation-mobile';

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

function isNavItemActive(
  href: string,
  pathWithoutLocale: string,
  locale: Locale,
): boolean {
  const itemPath = stripLocaleFromPathname(href);

  if (href === localizedPath(locale, '/')) {
    return pathWithoutLocale === '/';
  }

  return (
    pathWithoutLocale === itemPath ||
    pathWithoutLocale.startsWith(`${itemPath}/`)
  );
}

export default function Navigation({ locale }: NavigationProps) {
  const pathname = usePathname();
  const messages = getMessages(locale);
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  const alternateLocale = getAlternateLocale(locale);

  const navItems = [
    { href: localizedPath(locale, '/'), label: messages.nav.portfolio },
    { href: localizedPath(locale, '/o-mne'), label: messages.nav.about },
    { href: localizedPath(locale, '/blog'), label: messages.nav.blog },
  ].map(({ href, label }) => ({
    href,
    label,
    isActive: isNavItemActive(href, pathWithoutLocale, locale),
  }));

  return (
    <nav className="site-nav">
      {navItems.map(({ href, label, isActive }) => (
        <Link
          key={href}
          href={href}
          className="site-nav__link"
          data-active={isActive}
        >
          {label}
        </Link>
      ))}

      <Link
        href={localizedPath(alternateLocale, pathWithoutLocale)}
        className="site-nav__locale"
        aria-label={`Switch to ${alternateLocale.toUpperCase()}`}
      >
        {messages.localeSwitch}
      </Link>

      <NavigationMobile navItems={navItems} />
    </nav>
  );
}
