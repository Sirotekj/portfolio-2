import type { ProjectCategory } from '@/generated/prisma/client';

import { getOrCreatePortfolioPage } from '@/lib/actions/portfolio-page-prisma';
import { prisma } from '@/lib/prisma';
import type { PortfolioPageView, ProjectView } from '@/types/types';

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
  descriptionEn: string | null;
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
    descriptionEn: project.descriptionEn,
    category: project.category,
    gallery: project.gallery.filter(Boolean),
    sortOrder: project.sortOrder,
  };
}

export async function getPortfolioProjects(): Promise<ProjectView[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { image: { not: '' } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return projects.map(mapProject);
  } catch (error) {
    if (isMissingProjectsTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPortfolioPage(): Promise<PortfolioPageView | null> {
  try {
    const page = await getOrCreatePortfolioPage();

    return page.intro.trim() ? page : null;
  } catch (error) {
    if (isMissingProjectsTableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPortfolioIntro(): Promise<string | null> {
  const page = await getPortfolioPage();

  return page?.intro ?? null;
}
