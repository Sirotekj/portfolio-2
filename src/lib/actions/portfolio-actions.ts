'use server';

import { revalidatePath } from 'next/cache';

import type { FormState, ProjectFormData } from '@/types/types';

import {
  DeleteProject,
  GetProjectById,
  ReorderProjects,
  SaveProject,
  UpdateProject,
  cleanupReplacedProjectMedia,
  getNextProjectSortOrder,
  saveProjectImage,
  saveProjectVideo,
} from '@/lib/actions/portfolio-prisma';
import type { ProjectCategory } from '@/generated/prisma/client';

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function parseCategory(value: FormDataEntryValue | null): ProjectCategory | null {
  if (value === 'print' || value === 'digital' || value === 'personal' || value === 'logo') {
    return value;
  }

  return null;
}

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseProjectForm(formData: FormData): {
  project: ProjectFormData;
  errors: string[];
} {
  const errors: string[] = [];
  const title = String(formData.get('title') ?? '').trim();
  const titleEn = optionalText(formData.get('titleEn'));
  const description = String(formData.get('description') ?? '').trim();
  const descriptionEn = optionalText(formData.get('descriptionEn'));
  const category = parseCategory(formData.get('category'));

  if (!title) {
    errors.push('Vyplň název projektu (CS).');
  }

  return {
    project: {
      title,
      titleEn,
      description,
      descriptionEn,
      category,
    },
    errors,
  };
}

async function parseGallery(formData: FormData): Promise<string[]> {
  const existing = formData
    .getAll('existingGallery')
    .filter(
      (value): value is string =>
        typeof value === 'string' && value.trim() !== '',
    )
    .map((value) => value.trim());

  const uploads: string[] = [];

  for (const entry of formData.getAll('gallery')) {
    if (!(entry instanceof File) || entry.size === 0) {
      continue;
    }

    const upload = await saveProjectImage(entry);
    uploads.push(upload.basePath);
  }

  return [...existing, ...uploads];
}

async function parseVideo(formData: FormData): Promise<{
  video: string;
  videoWidth: number | null;
  videoHeight: number | null;
}> {
  const existing = String(formData.get('existingVideo') ?? '').trim();
  const file = formData.get('video');

  if (file instanceof File && file.size > 0) {
    const upload = await saveProjectVideo(file);

    return {
      video: upload.path,
      videoWidth: parseOptionalInt(formData.get('videoWidth')),
      videoHeight: parseOptionalInt(formData.get('videoHeight')),
    };
  }

  if (existing) {
    return {
      video: existing,
      videoWidth:
        parseOptionalInt(formData.get('existingVideoWidth')) ??
        parseOptionalInt(formData.get('videoWidth')),
      videoHeight:
        parseOptionalInt(formData.get('existingVideoHeight')) ??
        parseOptionalInt(formData.get('videoHeight')),
    };
  }

  return {
    video: '',
    videoWidth: null,
    videoHeight: null,
  };
}

function normalizeProjectMedia({
  gallery,
  video,
  videoWidth,
  videoHeight,
}: {
  gallery: string[];
  video: string;
  videoWidth: number | null;
  videoHeight: number | null;
}): {
  gallery: string[];
  video: string;
  videoWidth: number | null;
  videoHeight: number | null;
  error?: string;
} {
  const hasGallery = gallery.length > 0;
  const hasVideo = video.trim().length > 0;

  if (hasGallery && hasVideo) {
    return {
      gallery,
      video,
      videoWidth,
      videoHeight,
      error: 'Projekt může mít buď galerii obrázků, nebo video, ne obojí.',
    };
  }

  if (hasGallery) {
    return {
      gallery,
      video: '',
      videoWidth: null,
      videoHeight: null,
    };
  }

  if (hasVideo) {
    return {
      gallery: [],
      video,
      videoWidth,
      videoHeight,
    };
  }

  return {
    gallery: [],
    video: '',
    videoWidth: null,
    videoHeight: null,
  };
}

function revalidatePortfolioPaths(): void {
  revalidatePath('/edit/portfolio');
  revalidatePath('/cs');
  revalidatePath('/en');
}

export async function createProjectAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawId = formData.get('id');
  const id =
    typeof rawId === 'string' && rawId.trim() !== '' ? rawId.trim() : null;

  const { project, errors } = parseProjectForm(formData);

  if (errors.length > 0) {
    return { messages: [], errors };
  }

  const imageFile = formData.get('image');
  const existingImage = formData.get('existingImage');

  try {
    const gallery = await parseGallery(formData);
    const parsedVideo = await parseVideo(formData);
    const media = normalizeProjectMedia({
      gallery,
      video: parsedVideo.video,
      videoWidth: parsedVideo.videoWidth,
      videoHeight: parsedVideo.videoHeight,
    });

    if (media.error) {
      return { messages: [], errors: [media.error] };
    }

    if (id) {
      const previous = await GetProjectById(Number(id));

      if (!previous) {
        return { messages: [], errors: ['Projekt nebyl nalezen.'] };
      }

      let image = typeof existingImage === 'string' ? existingImage.trim() : undefined;
      let imageWidth: number | null | undefined;
      let imageHeight: number | null | undefined;

      if (imageFile instanceof File && imageFile.size > 0) {
        const upload = await saveProjectImage(imageFile);
        image = upload.basePath;
        imageWidth = upload.width;
        imageHeight = upload.height;
      }

      await cleanupReplacedProjectMedia(previous, {
        gallery: media.gallery,
        video: media.video,
      });

      await UpdateProject(Number(id), {
        ...project,
        ...(image !== undefined ? { image } : {}),
        ...(imageWidth !== undefined ? { imageWidth } : {}),
        ...(imageHeight !== undefined ? { imageHeight } : {}),
        gallery: media.gallery,
        video: media.video,
        videoWidth: media.videoWidth,
        videoHeight: media.videoHeight,
      });
    } else {
      if (!(imageFile instanceof File) || imageFile.size === 0) {
        return {
          messages: [],
          errors: ['Vyber hlavní obrázek projektu.'],
        };
      }

      const upload = await saveProjectImage(imageFile);
      const sortOrder = await getNextProjectSortOrder();

      await SaveProject({
        ...project,
        image: upload.basePath,
        imageWidth: upload.width,
        imageHeight: upload.height,
        gallery: media.gallery,
        video: media.video,
        videoWidth: media.videoWidth,
        videoHeight: media.videoHeight,
        sortOrder,
      });
    }

    revalidatePortfolioPaths();

    return {
      messages: [id ? 'Projekt byl upraven.' : 'Projekt byl vytvořen.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return {
      messages: [],
      errors: [message],
    };
  }
}

export async function deleteProjectAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const id = formData.get('id');

  if (typeof id !== 'string' || !id.trim()) {
    return { error: 'Chybí ID projektu.' };
  }

  try {
    await DeleteProject(id);
    revalidatePortfolioPaths();
    return {};
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Smazání projektu se nezdařilo.';

    return { error: message };
  }
}

export async function reorderProjectsAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  if (orderedIds.length === 0) {
    return {};
  }

  try {
    await ReorderProjects(orderedIds);
    revalidatePortfolioPaths();

    return {};
  } catch {
    return { error: 'Pořadí se nepodařilo uložit.' };
  }
}
