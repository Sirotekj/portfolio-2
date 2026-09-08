'use server';

import { revalidatePath } from 'next/cache';

import type { FormState } from '@/types/types';

import {
  getOrCreateSiteSettings,
  saveSettingsImage,
  updateSiteSettings,
} from '@/lib/actions/settings-prisma';

function optionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function parseSiteSettingsForm(formData: FormData) {
  return {
    siteTitle: String(formData.get('siteTitle') ?? '').trim(),
    siteTitleEn: optionalText(formData.get('siteTitleEn')),
    siteDescription: String(formData.get('siteDescription') ?? '').trim(),
    siteDescriptionEn: optionalText(formData.get('siteDescriptionEn')),
    keywords: String(formData.get('keywords') ?? '').trim(),
    keywordsEn: optionalText(formData.get('keywordsEn')),
    author: String(formData.get('author') ?? '').trim(),
    contactHeader: String(formData.get('contactHeader') ?? '').trim(),
    contactHeaderEn: optionalText(formData.get('contactHeaderEn')),
    contactEmail: String(formData.get('contactEmail') ?? '').trim(),
    contactLocation: String(formData.get('contactLocation') ?? '').trim(),
    contactPhone: String(formData.get('contactPhone') ?? '').trim(),
    formHeader: String(formData.get('formHeader') ?? '').trim(),
    formHeaderEn: optionalText(formData.get('formHeaderEn')),
    formNameLabel: String(formData.get('formNameLabel') ?? '').trim(),
    formNameLabelEn: optionalText(formData.get('formNameLabelEn')),
    formEmailLabel: String(formData.get('formEmailLabel') ?? '').trim(),
    formEmailLabelEn: optionalText(formData.get('formEmailLabelEn')),
    formMessageLabel: String(formData.get('formMessageLabel') ?? '').trim(),
    formMessageLabelEn: optionalText(formData.get('formMessageLabelEn')),
    formSubmitLabel: String(formData.get('formSubmitLabel') ?? '').trim(),
    formSubmitLabelEn: optionalText(formData.get('formSubmitLabelEn')),
  };
}

async function resolveImageField(
  formData: FormData,
  fileField: string,
  existingField: string,
  currentValue: string,
): Promise<string> {
  const file = formData.get(fileField);

  if (file instanceof File && file.size > 0) {
    const upload = await saveSettingsImage(file);
    return upload.basePath;
  }

  const existing = formData.get(existingField);

  if (typeof existing === 'string' && existing.trim()) {
    return existing.trim();
  }

  return currentValue;
}

function revalidateSettingsPaths(): void {
  revalidatePath('/edit/settings');
  revalidatePath('/cs');
  revalidatePath('/en');
}

export async function saveSiteSettingsAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const current = await getOrCreateSiteSettings();
    const fields = parseSiteSettingsForm(formData);

    const [favicon, logo, ogImage] = await Promise.all([
      resolveImageField(formData, 'favicon', 'existingFavicon', current.favicon),
      resolveImageField(formData, 'logo', 'existingLogo', current.logo),
      resolveImageField(formData, 'ogImage', 'existingOgImage', current.ogImage),
    ]);

    await updateSiteSettings({
      ...fields,
      favicon,
      logo,
      ogImage,
    });

    revalidateSettingsPaths();

    return { messages: ['Nastavení webu bylo uloženo.'], errors: [] };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Uložení se nezdařilo.';

    return { messages: [], errors: [message] };
  }
}

export { getOrCreateSiteSettings };
