import type { Metadata } from 'next';

import Portfolio from '@/components/portfolio';
import { getPortfolio } from '@/data/dummy-portfolio';
import { isValidLocale, type Locale } from '@/i18n/config';
import {
  getPortfolioIntro,
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
  const [projects, introFromDb] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioIntro(),
  ]);
  const portfolio = getPortfolio();

  return (
    <section>
      <div className="mx-auto container">
        <p className="mt-4">
          {introFromDb ?? portfolio.uvod}
        </p>
      </div>

      <Portfolio projects={projects} locale={locale} />
    </section>
  );
}
