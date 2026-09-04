import type { SiteSettings } from '@/generated/prisma/client';

import { prisma } from '@/lib/prisma';

export type SiteSettingsView = Pick<
  SiteSettings,
  | 'id'
  | 'siteTitle'
  | 'siteDescription'
  | 'favicon'
  | 'logo'
  | 'ogImage'
  | 'keywords'
  | 'author'
  | 'contactHeader'
  | 'contactEmail'
  | 'contactLocation'
  | 'contactPhone'
  | 'formHeader'
  | 'formNameLabel'
  | 'formEmailLabel'
  | 'formMessageLabel'
  | 'formSubmitLabel'
>;

const defaultSiteSettings: SiteSettingsView = {
  id: 1,
  siteTitle: '',
  siteDescription: '',
  favicon: '',
  logo: '',
  ogImage: '',
  keywords: '',
  author: '',
  contactHeader: 'Kontakt',
  contactEmail: '',
  contactLocation: '',
  contactPhone: '',
  formHeader: 'Kontaktní formulář',
  formNameLabel: 'Jméno',
  formEmailLabel: 'Váš mail',
  formMessageLabel: 'Zpráva',
  formSubmitLabel: 'Odeslat',
};

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
