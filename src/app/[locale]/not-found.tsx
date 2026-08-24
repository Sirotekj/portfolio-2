'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getLocaleFromPathname, localizedPath } from '@/i18n/routing';

export default function LocaleNotFound() {
  const pathname = usePathname();
  const locale: Locale = getLocaleFromPathname(pathname) ?? 'cs';
  const messages = getMessages(locale);

  return (
    <section className="container my-xlarge text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-medium text-3xl font-bold tracking-tight text-foreground">
        {messages.notFound.title}
      </h1>
      <p className="mx-auto mt-small max-w-md text-light">
        {messages.notFound.description}
      </p>
      <Link
        href={localizedPath(locale, '/')}
        className="mt-large inline-block rounded-md bg-primary px-large py-small text-background transition-opacity hover:opacity-90"
      >
        {messages.notFound.back}
      </Link>
    </section>
  );
}
