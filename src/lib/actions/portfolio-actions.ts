'use server';

import { revalidatePath } from 'next/cache';

import type { FormState, ProjectFormData } from '@/types/types';

import {
  DeleteProject,
  ReorderProjects,
  SaveProject,
  UpdateProject,
  getNextProjectSortOrder,
  saveProjectImage,
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

function parseProjectForm(formData: FormData): {
  project: ProjectFormData;
  errors: string[];
} {
  const errors: string[] = [];
  const title = String(formData.get('title') ?? '').trim();
  const titleEn = optionalText(formData.get('titleEn'));
  const description = String(formData.get('description') ?? '').trim();
  const category = parseCategory(formData.get('category'));

  if (!title) {
    errors.push('Vyplň název projektu (CS).');
  }

  return {
    project: {
      title,
      titleEn,
      description,
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

    if (id) {
      let image = typeof existingImage === 'string' ? existingImage.trim() : undefined;
      let imageWidth: number | null | undefined;
      let imageHeight: number | null | undefined;

      if (imageFile instanceof File && imageFile.size > 0) {
        const upload = await saveProjectImage(imageFile);
        image = upload.basePath;
        imageWidth = upload.width;
        imageHeight = upload.height;
      }

      await UpdateProject(Number(id), {
        ...project,
        ...(image !== undefined ? { image } : {}),
        ...(imageWidth !== undefined ? { imageWidth } : {}),
        ...(imageHeight !== undefined ? { imageHeight } : {}),
        gallery,
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
        gallery,
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

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = formData.get('id');

  if (typeof id !== 'string' || !id.trim()) {
    return;
  }

  await DeleteProject(id);
  revalidatePortfolioPaths();
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
