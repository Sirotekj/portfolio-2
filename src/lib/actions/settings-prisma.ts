import type { SiteSettingsView } from '@/types/types';

import type { ResponsiveImageUpload } from '@/lib/images/save-upload';
import { saveResponsiveImages } from '@/lib/images/save-upload';
import { prisma } from '@/lib/prisma';
import { defaultSiteSettings } from '@/lib/site-settings/defaults';

export async function saveSettingsImage(
  file: File,
): Promise<ResponsiveImageUpload> {
  return saveResponsiveImages({
    file,
    folder: 'uploads/settings',
  });
}

export async function getOrCreateSiteSettings(): Promise<SiteSettingsView> {
  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: defaultSiteSettings,
    update: {},
  });

  return settings;
}

export async function updateSiteSettings(
  data: Omit<SiteSettingsView, 'id'>,
): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { ...defaultSiteSettings, ...data },
    update: data,
  });
}
