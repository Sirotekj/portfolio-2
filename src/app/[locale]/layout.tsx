import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { locales, isValidLocale, type Locale } from '@/i18n/config';
import { buildPageMetadata } from '@/lib/site-settings/metadata';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';

  return buildPageMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Header locale={locale} />
      <main className="mt-16 mx-auto w-full flex-1 p-4 sm:p-6">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
