import { notFound } from 'next/navigation';

import Footer from '@/components/footer';
import Header from '@/components/header';
import { locales, isValidLocale, type Locale } from '@/i18n/config';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
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
      <main className="mt-9 mx-auto w-full flex-1 p-6">{children}</main>
      <Footer />
    </>
  );
}
