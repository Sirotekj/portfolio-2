import type { Metadata } from 'next';

import Portfolio from '@/components/portfolio';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getLocalizedPortfolioIntro } from '@/lib/portfolio/localize';
import {
  getPortfolioPage,
  getPortfolioProjects,
} from '@/lib/portfolio/queries';

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Portfolio',
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const [projects, portfolioPage] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioPage(),
  ]);
  const intro = getLocalizedPortfolioIntro(portfolioPage, locale).trim();

  return (
    <section>
      <div className="mx-auto container">
        {intro ? (
          <p className="mt-4">{intro}</p>
        ) : (
          <p className="mt-4 text-light">{messages.portfolio.empty.intro}</p>
        )}
      </div>

      <Portfolio projects={projects} locale={locale} />
    </section>
  );
}
