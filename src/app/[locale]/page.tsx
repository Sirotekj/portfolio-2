import type { Metadata } from 'next';

import Portfolio from '@/components/portfolio';
import { isValidLocale, type Locale } from '@/i18n/config';
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
  const [projects, portfolioPage] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioPage(),
  ]);
  const intro = portfolioPage
    ? getLocalizedPortfolioIntro(portfolioPage, locale)
    : null;

  return (
    <section>
      {intro ? (
        <div className="mx-auto container">
          <p className="mt-4">{intro}</p>
        </div>
      ) : null}

      <Portfolio projects={projects} locale={locale} />
    </section>
  );
}
