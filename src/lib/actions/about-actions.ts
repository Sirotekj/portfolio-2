'use server';

import { revalidatePath } from 'next/cache';

import type { FormState } from '@/types/types';

import {
  deleteEducation,
  deleteHobby,
  deleteJobExperience,
  deleteLanguage,
  deleteSkill,
  getOrCreateAboutPage,
  reorderEducation,
  reorderHobbies,
  reorderJobs,
  reorderLanguages,
  reorderSkills,
  saveAboutPhoto,
  saveEducation,
  saveHobby,
  saveJobExperience,
  saveLanguage,
  saveSkill,
  updateAboutPage,
} from '@/lib/actions/about-prisma';
import { deleteStoredMedia } from '@/lib/images/delete-media';

function revalidateAboutPaths(): void {
  revalidatePath('/edit/about');
  revalidatePath('/cs/o-mne');
  revalidatePath('/en/o-mne');
}

function parseLevel(value: FormDataEntryValue | null): number | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }

  return parsed;
}

function parseOptionalId(formData: FormData): number | undefined {
  const rawId = formData.get('id');

  if (typeof rawId !== 'string' || rawId.trim() === '') {
    return undefined;
  }

  const id = Number.parseInt(rawId, 10);
  return Number.isFinite(id) ? id : undefined;
}

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

export async function saveAboutPageAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const intro = String(formData.get('intro') ?? '').trim();
  const introEn = optionalText(formData.get('introEn'));
  const photoFile = formData.get('photo');
  const existingPhoto = formData.get('existingImage');

  if (!intro) {
    return { messages: [], errors: ['Vyplň úvodní text stránky O mně.'] };
  }

  try {
    const current = await getOrCreateAboutPage();
    let photo: string | undefined;

    if (photoFile instanceof File && photoFile.size > 0) {
      const upload = await saveAboutPhoto(photoFile);
      photo = upload.basePath;

      if (current.photo.trim() && current.photo.trim() !== photo) {
        await deleteStoredMedia(current.photo.trim());
      }
    } else if (typeof existingPhoto === 'string' && existingPhoto.trim()) {
      photo = existingPhoto.trim();
    }

    await updateAboutPage({
      intro,
      introEn,
      ...(photo !== undefined ? { photo } : {}),
    });

    revalidateAboutPaths();

    return { messages: ['Stránka O mně byla uložena.'], errors: [] };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function saveSkillAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = parseOptionalId(formData);
  const name = String(formData.get('name') ?? '').trim();
  const nameEn = optionalText(formData.get('nameEn'));
  const level = parseLevel(formData.get('level'));

  if (!name) {
    return { messages: [], errors: ['Vyplň název dovednosti.'] };
  }

  if (level === null) {
    return { messages: [], errors: ['Úroveň musí být číslo od 1 do 5.'] };
  }

  try {
    await saveSkill({ id, name, nameEn, level });
    revalidateAboutPaths();

    return {
      messages: [id ? 'Dovednost byla upravena.' : 'Dovednost byla přidána.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function deleteSkillAction(formData: FormData): Promise<void> {
  const id = parseOptionalId(formData);

  if (!id) {
    return;
  }

  await deleteSkill(id);
  revalidateAboutPaths();
}

export async function reorderSkillsAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  try {
    await reorderSkills(orderedIds);
    revalidateAboutPaths();
    return {};
  } catch {
    return { error: 'Pořadí dovedností se nepodařilo uložit.' };
  }
}

export async function saveLanguageAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = parseOptionalId(formData);
  const name = String(formData.get('name') ?? '').trim();
  const nameEn = optionalText(formData.get('nameEn'));
  const level = parseLevel(formData.get('level'));

  if (!name) {
    return { messages: [], errors: ['Vyplň název jazyka.'] };
  }

  if (level === null) {
    return { messages: [], errors: ['Úroveň musí být číslo od 1 do 5.'] };
  }

  try {
    await saveLanguage({ id, name, nameEn, level });
    revalidateAboutPaths();

    return {
      messages: [id ? 'Jazyk byl upraven.' : 'Jazyk byl přidán.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function deleteLanguageAction(formData: FormData): Promise<void> {
  const id = parseOptionalId(formData);

  if (!id) {
    return;
  }

  await deleteLanguage(id);
  revalidateAboutPaths();
}

export async function reorderLanguagesAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  try {
    await reorderLanguages(orderedIds);
    revalidateAboutPaths();
    return {};
  } catch {
    return { error: 'Pořadí jazyků se nepodařilo uložit.' };
  }
}

export async function saveEducationAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = parseOptionalId(formData);
  const years = String(formData.get('years') ?? '').trim();
  const school = String(formData.get('school') ?? '').trim();
  const schoolEn = optionalText(formData.get('schoolEn'));

  if (!years || !school) {
    return { messages: [], errors: ['Vyplň roky i název školy / kurzu.'] };
  }

  try {
    await saveEducation({ id, years, school, schoolEn });
    revalidateAboutPaths();

    return {
      messages: [id ? 'Vzdělání bylo upraveno.' : 'Vzdělání bylo přidáno.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function deleteEducationAction(formData: FormData): Promise<void> {
  const id = parseOptionalId(formData);

  if (!id) {
    return;
  }

  await deleteEducation(id);
  revalidateAboutPaths();
}

export async function reorderEducationAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  try {
    await reorderEducation(orderedIds);
    revalidateAboutPaths();
    return {};
  } catch {
    return { error: 'Pořadí vzdělání se nepodařilo uložit.' };
  }
}

export async function saveJobAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = parseOptionalId(formData);
  const years = String(formData.get('years') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const descriptionEn = optionalText(formData.get('descriptionEn'));

  if (!years || !description) {
    return {
      messages: [],
      errors: ['Vyplň roky i popis pracovní zkušenosti.'],
    };
  }

  try {
    await saveJobExperience({ id, years, description, descriptionEn });
    revalidateAboutPaths();

    return {
      messages: [
        id ? 'Pracovní zkušenost byla upravena.' : 'Pracovní zkušenost byla přidána.',
      ],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function deleteJobAction(formData: FormData): Promise<void> {
  const id = parseOptionalId(formData);

  if (!id) {
    return;
  }

  await deleteJobExperience(id);
  revalidateAboutPaths();
}

export async function reorderJobsAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  try {
    await reorderJobs(orderedIds);
    revalidateAboutPaths();
    return {};
  } catch {
    return { error: 'Pořadí pracovních zkušeností se nepodařilo uložit.' };
  }
}

export async function saveHobbyAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = parseOptionalId(formData);
  const name = String(formData.get('name') ?? '').trim();
  const nameEn = optionalText(formData.get('nameEn'));

  if (!name) {
    return { messages: [], errors: ['Vyplň název koníčku.'] };
  }

  try {
    await saveHobby({ id, name, nameEn });
    revalidateAboutPaths();

    return {
      messages: [id ? 'Koníček byl upraven.' : 'Koníček byl přidán.'],
      errors: [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export async function deleteHobbyAction(formData: FormData): Promise<void> {
  const id = parseOptionalId(formData);

  if (!id) {
    return;
  }

  await deleteHobby(id);
  revalidateAboutPaths();
}

export async function reorderHobbiesAction(
  orderedIds: number[],
): Promise<{ error?: string }> {
  try {
    await reorderHobbies(orderedIds);
    revalidateAboutPaths();
    return {};
  } catch {
    return { error: 'Pořadí koníčků se nepodařilo uložit.' };
  }
}
