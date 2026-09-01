'use server';

import { revalidatePath } from 'next/cache';

import type { BlogFormData, FormState } from '@/types/types';

import { isHtmlEmpty, slugify } from '@/lib/utils/slug';

import { DeleteBlog, SaveBlog, UpdateBlog, saveBlogImage } from './blog-prisma';

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function optionalHtml(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string' || isHtmlEmpty(value)) {
    return null;
  }

  return value;
}

function revalidateBlogPaths(blog: BlogFormData): void {
  revalidatePath('/edit/blog');

  for (const locale of ['cs', 'en'] as const) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/${blog.slug}`);

    if (blog.slugEn) {
      revalidatePath(`/${locale}/blog/${blog.slugEn}`);
    }
  }
}

function parseBlogForm(formData: FormData): {
  blog: BlogFormData;
  errors: string[];
} {
  const errors: string[] = [];
  const title = String(formData.get('title') ?? '').trim();
  const titleEn = optionalText(formData.get('titleEn'));
  const slugInput = String(formData.get('slug') ?? '').trim();
  const slugEnInput = optionalText(formData.get('slugEn'));
  const intro = String(formData.get('intro') ?? '').trim();
  const introEn = optionalText(formData.get('introEn'));
  const content = String(formData.get('content') ?? '');
  const contentEn = optionalHtml(formData.get('contentEn'));

  if (!title) {
    errors.push('Vyplň název článku (CS).');
  }

  if (!intro) {
    errors.push('Vyplň úvodní text (CS).');
  }

  if (isHtmlEmpty(content)) {
    errors.push('Vyplň hlavní text článku (CS).');
  }

  const slug = slugInput || slugify(title);

  if (!slug) {
    errors.push('Slug (CS) musí být vyplněný.');
  }

  const slugEn = slugEnInput ? slugify(slugEnInput) || slugEnInput : null;

  if (slugEnInput && !slugEn) {
    errors.push('Anglický slug není platný.');
  }

  return {
    blog: {
      title,
      titleEn,
      slug,
      slugEn,
      intro,
      introEn,
      content,
      contentEn,
    },
    errors,
  };
}

export async function createAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawId = formData.get('id');
  const id =
    typeof rawId === 'string' && rawId.trim() !== '' ? rawId.trim() : null;

  const { blog, errors } = parseBlogForm(formData);

  if (errors.length > 0) {
    return { messages: [], errors };
  }

  const imageFile = formData.get('image');
  const existingImage = formData.get('existingImage');
  let imageUrl: string | undefined;

  try {
    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await saveBlogImage(imageFile);
    } else if (typeof existingImage === 'string' && existingImage.trim()) {
      imageUrl = existingImage.trim();
    }

    if (id) {
      await UpdateBlog(blog, imageUrl, id);
    } else {
      await SaveBlog(blog, imageUrl);
    }

    revalidateBlogPaths(blog);

    return {
      messages: [id ? 'Článek byl upraven.' : 'Článek byl vytvořen.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    if (message.includes('Unique constraint')) {
      return {
        messages: [],
        errors: ['Slug (CS nebo EN) už existuje — zvol jiný.'],
      };
    }

    return {
      messages: [],
      errors: [message],
    };
  }
}

export async function deleteAction(formData: FormData): Promise<void> {
  const id = formData.get('id');

  if (typeof id !== 'string' || !id.trim()) {
    return;
  }

  await DeleteBlog(id);
  revalidatePath('/edit/blog');
  revalidatePath('/cs/blog');
  revalidatePath('/en/blog');
}
