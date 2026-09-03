import type { ProjectCategory } from '@/generated/prisma/client';

import { getAllProjects as getDummyProjects } from '@/data/dummy-portfolio';
import { prisma } from '@/lib/prisma';
import type { Categories, ProjectView } from '@/types/types';

function isMissingProjectsTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2021'
  );
}

function mapProject(project: {
  id: number;
  title: string;
  titleEn: string | null;
  image: string;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string;
  category: ProjectCategory | null;
  gallery: string[];
  sortOrder: number;
}): ProjectView {
  return {
    id: project.id,
    title: project.title,
    titleEn: project.titleEn,
    image: project.image,
    imageWidth: project.imageWidth,
    imageHeight: project.imageHeight,
    description: project.description,
    category: project.category,
    gallery: project.gallery.filter(Boolean),
    sortOrder: project.sortOrder,
  };
}

function getDummyProjectViews(): ProjectView[] {
  return getDummyProjects()
    .filter((project) => project.image)
    .map((project, index) => ({
      id: -(index + 1),
      title: project.title,
      titleEn: null,
      image: project.image,
      imageWidth: null,
      imageHeight: null,
      description: project.description,
      category: (project.category || null) as Categories | null,
      gallery: project.gallery,
      sortOrder: index,
    }));
}

export async function getPortfolioProjects(): Promise<ProjectView[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { image: { not: '' } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    if (projects.length > 0) {
      return projects.map(mapProject);
    }

    return getDummyProjectViews();
  } catch (error) {
    if (isMissingProjectsTableError(error)) {
      return getDummyProjectViews();
    }

    throw error;
  }
}

export async function getPortfolioIntro(): Promise<string | null> {
  try {
    const page = await prisma.portfolioPage.findUnique({ where: { id: 1 } });

    return page?.intro ?? null;
  } catch (error) {
    if (isMissingProjectsTableError(error)) {
      return null;
    }

    throw error;
  }
}
