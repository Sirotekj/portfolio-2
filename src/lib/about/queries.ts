import { getAboutEditorData } from '@/lib/actions/about-prisma';
import type { AboutEditorData, AboutPageView } from '@/types/types';

function isMissingAboutTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2021'
  );
}

function hasAboutContent(data: AboutEditorData): boolean {
  return (
    Boolean(data.aboutPage.intro.trim()) ||
    data.skills.length > 0 ||
    data.languages.length > 0 ||
    data.education.length > 0 ||
    data.jobs.length > 0 ||
    data.hobbies.length > 0
  );
}

export async function getAboutPageDataFromDb(): Promise<AboutEditorData | null> {
  try {
    const data = await getAboutEditorData();

    return hasAboutContent(data) ? data : null;
  } catch (error) {
    if (isMissingAboutTableError(error)) {
      return null;
    }

    throw error;
  }
}

export function splitAboutIntro(intro: string): string[] {
  return intro
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export type { AboutPageView };
