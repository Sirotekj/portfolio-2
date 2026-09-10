import { getAboutEditorData } from '@/lib/actions/about-prisma';
import type { AboutEditorData, AboutPageView } from '@/types/types';

const emptyAboutData: AboutEditorData = {
  aboutPage: {
    id: 1,
    photo: '',
    intro: '',
    introEn: null,
  },
  skills: [],
  languages: [],
  education: [],
  jobs: [],
  hobbies: [],
};

function isMissingAboutTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2021'
  );
}

export async function getAboutPageData(): Promise<AboutEditorData> {
  try {
    return await getAboutEditorData();
  } catch (error) {
    if (isMissingAboutTableError(error)) {
      return emptyAboutData;
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
