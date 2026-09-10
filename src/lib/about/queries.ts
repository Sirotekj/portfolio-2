import { getAboutPublicData } from '@/lib/about/db';
import { isPrismaSchemaMismatchError } from '@/lib/prisma/errors';
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

export async function getAboutPageData(): Promise<AboutEditorData> {
  try {
    return await getAboutPublicData();
  } catch (error) {
    if (isPrismaSchemaMismatchError(error)) {
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
