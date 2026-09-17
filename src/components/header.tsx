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
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href={localizedPath(locale, '/')}
          className="site-logo-link"
          aria-label={messages.home}
        >
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- responzivní logo z uploads/
            <img src={logoSrc} alt={brand} className="site-logo" />
          ) : (
            brand
          )}
        </Link>
        <Navigation locale={locale} />
      </div>
    </header>
  );
}
