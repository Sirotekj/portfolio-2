import type { ProjectCategory } from '@/generated/prisma/client';

import type { ProjectView } from '@/types/types';

import type { ResponsiveImageUpload } from '@/lib/images/process-upload';
import { saveResponsiveImages } from '@/lib/images/process-upload';
import { prisma } from '@/lib/prisma';

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

export async function saveProjectImage(
  file: File,
): Promise<ResponsiveImageUpload> {
  return saveResponsiveImages({
    file,
    folder: 'uploads/portfolio',
  });
}

export type ProjectWriteData = {
  title: string;
  titleEn: string | null;
  image: string;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string;
  category: ProjectCategory | null;
  gallery: string[];
  sortOrder: number;
};

export async function SaveProject(data: ProjectWriteData): Promise<void> {
  await prisma.project.create({
    data: {
      title: data.title,
      titleEn: data.titleEn,
      image: data.image,
      imageWidth: data.imageWidth,
      imageHeight: data.imageHeight,
      description: data.description,
      category: data.category,
      gallery: data.gallery,
      sortOrder: data.sortOrder,
    },
  });
}

export async function UpdateProject(
  id: number,
  data: Partial<ProjectWriteData>,
): Promise<void> {
  await prisma.project.update({
    where: { id },
    data,
  });
}

export async function DeleteProject(id: string): Promise<void> {
  await prisma.project.delete({
    where: { id: Number(id) },
  });
}

export async function GetAllProjects(): Promise<ProjectView[]> {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return projects.map(mapProject);
}

export async function GetProjectById(id: number): Promise<ProjectView | null> {
  const project = await prisma.project.findUnique({ where: { id } });

  return project ? mapProject(project) : null;
}

export async function getNextProjectSortOrder(): Promise<number> {
  const result = await prisma.project.aggregate({
    _max: { sortOrder: true },
  });

  return (result._max.sortOrder ?? -1) + 1;
}

export async function ReorderProjects(orderedIds: number[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.project.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}

export { mapProject };
