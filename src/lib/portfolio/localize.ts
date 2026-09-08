import type { Locale } from '@/i18n/config';
import type { PortfolioPageView, ProjectView } from '@/types/types';

export function getProjectLocalizedTitle(
  project: ProjectView,
  locale: Locale,
): string {
  if (locale === 'en' && project.titleEn?.trim()) {
    return project.titleEn.trim();
  }

  return project.title;
}

export function getLocalizedPortfolioIntro(
  page: PortfolioPageView,
  locale: Locale,
): string {
  if (locale === 'en' && page.introEn?.trim()) {
    return page.introEn.trim();
  }

  return page.intro;
}
