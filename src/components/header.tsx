import Link from 'next/link';

import Navigation from './navigation';
import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { localizedPath } from '@/i18n/routing';
import { getSiteBranding } from '@/lib/site-settings/metadata';

type HeaderProps = {
  locale: Locale;
};

export default async function Header({ locale }: HeaderProps) {
  const messages = getMessages(locale);
  const { brand, logoSrc } = await getSiteBranding(locale);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/75 bg-opacity-50 px-6 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between gap-8">
        <Link
          href={localizedPath(locale, '/')}
          className="flex h-9 shrink-0 items-center justify-center rounded-md text-xl font-semibold text-foreground"
          aria-label={messages.home}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- responzivní logo z uploads/
            <img src={logoSrc} alt={brand} className="h-9 w-auto max-w-40 object-contain" />
          ) : (
            brand
          )}
        </Link>
        <Navigation locale={locale} />
      </div>
    </header>
  );
}
