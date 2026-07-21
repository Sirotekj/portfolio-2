import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const montserrat = Montserrat({
  variable: '--fon-montserrat',
  subsets: ['latin'],
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
    <html lang="cs" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="mt-9 mx-auto w-full max-w-1536px flex-1 p-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
