import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${montserrat.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className={`${montserrat.className} flex min-h-full flex-col`}>
        <Header />
        <main className="mt-9 mx-auto w-full flex-1 p-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
