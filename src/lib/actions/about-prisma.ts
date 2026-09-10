import type { AboutEditorData, AboutPageView } from '@/types/types';

import {
  buildAboutEditorData,
  fetchAboutEditorLists,
} from '@/lib/about/db';
import type { ResponsiveImageUpload } from '@/lib/images/save-upload';
import { saveResponsiveImages } from '@/lib/images/save-upload';
import { prisma } from '@/lib/prisma';

const aboutPageDefaults = {
  intro: '',
  introEn: null,
  photo: '',
};

function mapAboutPage(aboutPage: AboutPageView): AboutPageView {
  return aboutPage;
}

export async function saveAboutPhoto(file: File): Promise<ResponsiveImageUpload> {
  return saveResponsiveImages({
    file,
    folder: 'uploads/about',
  });
}

export async function getOrCreateAboutPage(): Promise<AboutPageView> {
  const aboutPage = await prisma.aboutPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...aboutPageDefaults },
    update: {},
  });

  return mapAboutPage(aboutPage);
}

export async function updateAboutPage(data: {
  intro: string;
  introEn: string | null;
  photo?: string;
}): Promise<void> {
  await prisma.aboutPage.upsert({
    where: { id: 1 },
    create: { id: 1, ...aboutPageDefaults, ...data },
    update: data,
  });
}

export async function getAboutEditorData(): Promise<AboutEditorData> {
  const [aboutPage, lists] = await Promise.all([
    getOrCreateAboutPage(),
    fetchAboutEditorLists(),
  ]);

  return buildAboutEditorData(
    aboutPage,
    lists.skills,
    lists.languages,
    lists.education,
    lists.jobs,
    lists.hobbies,
  );
}

async function getNextSortOrder(
  model: 'skill' | 'language' | 'education' | 'jobExperience' | 'hobby',
): Promise<number> {
  const aggregate = await {
    skill: prisma.skill.aggregate({ _max: { sortOrder: true } }),
    language: prisma.language.aggregate({ _max: { sortOrder: true } }),
    education: prisma.education.aggregate({ _max: { sortOrder: true } }),
    jobExperience: prisma.jobExperience.aggregate({ _max: { sortOrder: true } }),
    hobby: prisma.hobby.aggregate({ _max: { sortOrder: true } }),
  }[model];

  return (aggregate._max.sortOrder ?? -1) + 1;
}

export async function saveSkill(data: {
  id?: number;
  name: string;
  nameEn: string | null;
  level: number;
}): Promise<void> {
  if (data.id) {
    await prisma.skill.update({
      where: { id: data.id },
      data: { name: data.name, nameEn: data.nameEn, level: data.level },
    });
    return;
  }

  await prisma.skill.create({
    data: {
      name: data.name,
      nameEn: data.nameEn,
      level: data.level,
      sortOrder: await getNextSortOrder('skill'),
    },
  });
}

export async function deleteSkill(id: number): Promise<void> {
  await prisma.skill.delete({ where: { id } });
}

export async function reorderSkills(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.skill.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function saveLanguage(data: {
  id?: number;
  name: string;
  nameEn: string | null;
  level: number;
}): Promise<void> {
  if (data.id) {
    await prisma.language.update({
      where: { id: data.id },
      data: { name: data.name, nameEn: data.nameEn, level: data.level },
    });
    return;
  }

  await prisma.language.create({
    data: {
      name: data.name,
      nameEn: data.nameEn,
      level: data.level,
      sortOrder: await getNextSortOrder('language'),
    },
  });
}

export async function deleteLanguage(id: number): Promise<void> {
  await prisma.language.delete({ where: { id } });
}

export async function reorderLanguages(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.language.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function saveEducation(data: {
  id?: number;
  years: string;
  school: string;
  schoolEn: string | null;
}): Promise<void> {
  if (data.id) {
    await prisma.education.update({
      where: { id: data.id },
      data: { years: data.years, school: data.school, schoolEn: data.schoolEn },
    });
    return;
  }

  await prisma.education.create({
    data: {
      years: data.years,
      school: data.school,
      schoolEn: data.schoolEn,
      sortOrder: await getNextSortOrder('education'),
    },
  });
}

export async function deleteEducation(id: number): Promise<void> {
  await prisma.education.delete({ where: { id } });
}

export async function reorderEducation(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.education.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function saveJobExperience(data: {
  id?: number;
  years: string;
  description: string;
  descriptionEn: string | null;
}): Promise<void> {
  if (data.id) {
    await prisma.jobExperience.update({
      where: { id: data.id },
      data: {
        years: data.years,
        description: data.description,
        descriptionEn: data.descriptionEn,
      },
    });
    return;
  }

  await prisma.jobExperience.create({
    data: {
      years: data.years,
      description: data.description,
      descriptionEn: data.descriptionEn,
      sortOrder: await getNextSortOrder('jobExperience'),
    },
  });
}

export async function deleteJobExperience(id: number): Promise<void> {
  await prisma.jobExperience.delete({ where: { id } });
}

export async function reorderJobs(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.jobExperience.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}

export async function saveHobby(data: {
  id?: number;
  name: string;
  nameEn: string | null;
}): Promise<void> {
  if (data.id) {
    await prisma.hobby.update({
      where: { id: data.id },
      data: { name: data.name, nameEn: data.nameEn },
    });
    return;
  }

  await prisma.hobby.create({
    data: {
      name: data.name,
      nameEn: data.nameEn,
      sortOrder: await getNextSortOrder('hobby'),
    },
  });
}

export async function deleteHobby(id: number): Promise<void> {
  await prisma.hobby.delete({ where: { id } });
}

export async function reorderHobbies(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.hobby.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
}
