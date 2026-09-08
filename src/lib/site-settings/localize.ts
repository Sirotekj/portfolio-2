import type { Locale } from '@/i18n/config';
import type { SiteSettingsView } from '@/types/types';

function pickLocalized(
  primary: string,
  localized: string | null | undefined,
  locale: Locale,
): string {
  if (locale === 'en' && localized?.trim()) {
    return localized.trim();
  }

  return primary;
}

export function localizeSiteSettings(
  settings: SiteSettingsView,
  locale: Locale,
) {
  return {
    siteTitle: pickLocalized(settings.siteTitle, settings.siteTitleEn, locale),
    siteDescription: pickLocalized(
      settings.siteDescription,
      settings.siteDescriptionEn,
      locale,
    ),
    keywords: pickLocalized(settings.keywords, settings.keywordsEn, locale),
    author: settings.author,
    contactHeader: pickLocalized(
      settings.contactHeader,
      settings.contactHeaderEn,
      locale,
    ),
    contactEmail: settings.contactEmail,
    contactLocation: settings.contactLocation,
    contactPhone: settings.contactPhone,
    formHeader: pickLocalized(settings.formHeader, settings.formHeaderEn, locale),
    formNameLabel: pickLocalized(
      settings.formNameLabel,
      settings.formNameLabelEn,
      locale,
    ),
    formEmailLabel: pickLocalized(
      settings.formEmailLabel,
      settings.formEmailLabelEn,
      locale,
    ),
    formMessageLabel: pickLocalized(
      settings.formMessageLabel,
      settings.formMessageLabelEn,
      locale,
    ),
    formSubmitLabel: pickLocalized(
      settings.formSubmitLabel,
      settings.formSubmitLabelEn,
      locale,
    ),
    favicon: settings.favicon,
    logo: settings.logo,
    ogImage: settings.ogImage,
  };
}
