import type { Locale } from '@/i18n/config';
import type { ProjectView } from '@/types/types';

export function getProjectLocalizedTitle(
  project: ProjectView,
  locale: Locale,
): string {
  if (locale === 'en' && project.titleEn?.trim()) {
    return project.titleEn.trim();
  }

  return project.title;
}
