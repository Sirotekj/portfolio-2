import type {
  AboutEditorData,
  AboutPageView,
  EducationView,
  HobbyView,
  JobExperienceView,
  LanguageView,
  SkillView,
} from '@/types/types';

import { prisma } from '@/lib/prisma';

const aboutListOrder = [{ sortOrder: 'asc' as const }, { id: 'asc' as const }];

function mapAboutPage(aboutPage: AboutPageView): AboutPageView {
  return aboutPage;
}

function mapSkill(skill: {
  id: number;
  name: string;
  nameEn: string | null;
  level: number;
  sortOrder: number;
}): SkillView {
  return skill;
}

function mapLanguage(language: {
  id: number;
  name: string;
  nameEn: string | null;
  level: number;
  sortOrder: number;
}): LanguageView {
  return language;
}

function mapEducation(education: {
  id: number;
  years: string;
  school: string;
  schoolEn: string | null;
  sortOrder: number;
}): EducationView {
  return education;
}

function mapJob(job: {
  id: number;
  years: string;
  description: string;
  descriptionEn: string | null;
  sortOrder: number;
}): JobExperienceView {
  return job;
}

function mapHobby(hobby: {
  id: number;
  name: string;
  nameEn: string | null;
  sortOrder: number;
}): HobbyView {
  return hobby;
}

export function buildAboutEditorData(
  aboutPage: AboutPageView | null,
  skills: Parameters<typeof mapSkill>[0][],
  languages: Parameters<typeof mapLanguage>[0][],
  education: Parameters<typeof mapEducation>[0][],
  jobs: Parameters<typeof mapJob>[0][],
  hobbies: Parameters<typeof mapHobby>[0][],
): AboutEditorData {
  return {
    aboutPage: aboutPage ?? { id: 1, photo: '', intro: '', introEn: null },
    skills: skills.map(mapSkill),
    languages: languages.map(mapLanguage),
    education: education.map(mapEducation),
    jobs: jobs.map(mapJob),
    hobbies: hobbies.map(mapHobby),
  };
}

async function fetchAboutRelatedLists() {
  const [skills, languages, education, jobs, hobbies] = await Promise.all([
    prisma.skill.findMany({ orderBy: aboutListOrder }),
    prisma.language.findMany({ orderBy: aboutListOrder }),
    prisma.education.findMany({ orderBy: aboutListOrder }),
    prisma.jobExperience.findMany({ orderBy: aboutListOrder }),
    prisma.hobby.findMany({ orderBy: aboutListOrder }),
  ]);

  return { skills, languages, education, jobs, hobbies };
}

/** Read-only load for the public About page (no upsert, no sharp). */
export async function getAboutPublicData(): Promise<AboutEditorData> {
  const [aboutPage, lists] = await Promise.all([
    prisma.aboutPage.findUnique({ where: { id: 1 } }),
    fetchAboutRelatedLists(),
  ]);

  return buildAboutEditorData(
    aboutPage ? mapAboutPage(aboutPage) : null,
    lists.skills,
    lists.languages,
    lists.education,
    lists.jobs,
    lists.hobbies,
  );
}

/** Loads related lists for the admin editor (about page row supplied separately). */
export async function fetchAboutEditorLists() {
  return fetchAboutRelatedLists();
}
