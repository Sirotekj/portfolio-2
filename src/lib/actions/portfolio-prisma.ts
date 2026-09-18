import type { ProjectCategory } from '@/generated/prisma/client';

import type { ProjectView } from '@/types/types';

import type { ResponsiveImageUpload } from '@/lib/images/save-upload';
import { saveResponsiveImages } from '@/lib/images/save-upload';
import { deleteStoredImage } from '@/lib/images/delete-upload';
import { saveProjectVideo } from '@/lib/videos/save-video';
import { prisma } from '@/lib/prisma';

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
  video: string;
  videoWidth: number | null;
  videoHeight: number | null;
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
    video: project.video,
    videoWidth: project.videoWidth,
    videoHeight: project.videoHeight,
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

export { saveProjectVideo };

export type ProjectWriteData = {
  title: string;
  titleEn: string | null;
  image: string;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string;
  descriptionEn: string | null;
  category: ProjectCategory | null;
  gallery: string[];
  video: string;
  videoWidth: number | null;
  videoHeight: number | null;
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
      descriptionEn: data.descriptionEn,
      category: data.category,
      gallery: data.gallery,
      video: data.video,
      videoWidth: data.videoWidth,
      videoHeight: data.videoHeight,
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

async function deleteProjectMediaPaths(paths: string[]): Promise<void> {
  await Promise.all(
    paths.filter(Boolean).map((mediaPath) => deleteStoredImage(mediaPath)),
  );
}

export async function DeleteProject(id: string): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!project) {
    return;
  }

  const mediaPaths = new Set<string>();

  if (project.image.trim()) {
    mediaPaths.add(project.image.trim());
  }

  for (const galleryImage of project.gallery) {
    if (galleryImage.trim()) {
      mediaPaths.add(galleryImage.trim());
    }
  }

  if (project.video.trim()) {
    mediaPaths.add(project.video.trim());
  }

  await deleteProjectMediaPaths([...mediaPaths]);

  await prisma.project.delete({
    where: { id: Number(id) },
  });
}

export async function cleanupReplacedProjectMedia(
  previous: Pick<ProjectView, 'gallery' | 'video'>,
  next: Pick<ProjectView, 'gallery' | 'video'>,
): Promise<void> {
  const pathsToDelete = new Set<string>();

  if (previous.video.trim() && previous.video !== next.video) {
    pathsToDelete.add(previous.video.trim());
  }

  for (const galleryImage of previous.gallery) {
    if (galleryImage.trim() && !next.gallery.includes(galleryImage.trim())) {
      pathsToDelete.add(galleryImage.trim());
    }
  }

  if (next.video.trim() && previous.gallery.length > 0) {
    for (const galleryImage of previous.gallery) {
      if (galleryImage.trim()) {
        pathsToDelete.add(galleryImage.trim());
      }
    }
  }

  if (next.gallery.length > 0 && previous.video.trim()) {
    pathsToDelete.add(previous.video.trim());
  }

  await deleteProjectMediaPaths([...pathsToDelete]);
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
