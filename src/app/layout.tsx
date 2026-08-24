import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Montserrat } from 'next/font/google';

import { defaultLocale, isValidLocale, type Locale } from '@/i18n/config';

import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio',
    template: 'SarArt | %s',
  },
  description: 'Osobní portfolio a blog',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const headerLocale = headersList.get('x-next-locale');
  const locale: Locale =
    headerLocale && isValidLocale(headerLocale) ? headerLocale : defaultLocale;

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className={`${montserrat.className} flex min-h-full flex-col`}>
        {children}
      </body>
    </html>
  );
}
