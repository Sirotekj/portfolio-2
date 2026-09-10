import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
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

function pickFooterLabel(
  locale: Locale,
  cs: string,
  en: string | null | undefined,
  fallback: string,
): string {
  if (locale === 'en') {
    return en?.trim() || fallback;
  }

  return cs.trim() || fallback;
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

export function getLocalizedFooterSettings(
  settings: SiteSettingsView,
  locale: Locale,
) {
  const footerDefaults = getMessages(locale).footer;

  return {
    contactHeader: pickFooterLabel(
      locale,
      settings.contactHeader,
      settings.contactHeaderEn,
      footerDefaults.contactHeader,
    ),
    contactEmail: settings.contactEmail,
    contactLocation: settings.contactLocation,
    contactPhone: settings.contactPhone,
    formHeader: pickFooterLabel(
      locale,
      settings.formHeader,
      settings.formHeaderEn,
      footerDefaults.formHeader,
    ),
    formNameLabel: pickFooterLabel(
      locale,
      settings.formNameLabel,
      settings.formNameLabelEn,
      footerDefaults.formNameLabel,
    ),
    formEmailLabel: pickFooterLabel(
      locale,
      settings.formEmailLabel,
      settings.formEmailLabelEn,
      footerDefaults.formEmailLabel,
    ),
    formMessageLabel: pickFooterLabel(
      locale,
      settings.formMessageLabel,
      settings.formMessageLabelEn,
      footerDefaults.formMessageLabel,
    ),
    formSubmitLabel: pickFooterLabel(
      locale,
      settings.formSubmitLabel,
      settings.formSubmitLabelEn,
      footerDefaults.formSubmitLabel,
    ),
  };
}
