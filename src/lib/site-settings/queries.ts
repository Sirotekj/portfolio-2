import type { SiteSettingsView } from '@/types/types';

import { defaultSiteSettings } from '@/lib/site-settings/defaults';
import { prisma } from '@/lib/prisma';

function isMissingSiteSettingsTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2021'
  );
}

export async function getSiteSettings(): Promise<SiteSettingsView> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

    return settings ?? defaultSiteSettings;
  } catch (error) {
    if (isMissingSiteSettingsTableError(error)) {
      return defaultSiteSettings;
    }

    throw error;
  }
}

export { defaultSiteSettings };
