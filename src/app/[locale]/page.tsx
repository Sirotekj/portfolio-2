import type { Metadata } from 'next';

import Portfolio from '@/components/portfolio';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getLocalizedPortfolioIntro } from '@/lib/portfolio/localize';
import {
  getPortfolioPage,
  getPortfolioProjects,
} from '@/lib/portfolio/queries';
import { buildPageMetadata } from '@/lib/site-settings/metadata';

type PortfolioPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const portfolioPage = await getPortfolioPage();
  const intro = portfolioPage
    ? getLocalizedPortfolioIntro(portfolioPage, locale).trim()
    : '';

  return buildPageMetadata(locale, {
    title: messages.nav.portfolio,
    description: intro || undefined,
  });
}

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
      <div className="portfolio-intro container">
        {intro ? (
          <p className="portfolio-intro__text">{intro}</p>
        ) : (
          <p className="portfolio-intro__text page-muted">
            {messages.portfolio.empty.intro}
          </p>
        )}
      </div>

      <Portfolio projects={projects} locale={locale} />
    </section>
  );
}
