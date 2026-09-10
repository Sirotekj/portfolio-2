import type { Metadata } from 'next';

import type { Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
} from '@/lib/images/responsive';

import { localizeSiteSettings } from '@/lib/site-settings/localize';
import { getSiteSettings } from '@/lib/site-settings/queries';

type PageMetadataOptions = {
  title?: string;
  description?: string;
  ogImage?: string;
};

function getMetadataBaseUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return new URL(configured);
  }

  return new URL('http://localhost:3000');
}

function resolveMetadataImage(storedPath: string): string | undefined {
  if (!storedPath.trim()) {
    return undefined;
  }

  return getResponsiveImagePath(storedPath, DEFAULT_IMAGE_WIDTH);
}

function resolveOgImage(storedPath: string): string | undefined {
  if (!storedPath.trim()) {
    return undefined;
  }

  return getResponsiveImagePath(storedPath, 1720);
}

export function getSiteBrandName(locale: Locale, siteTitle: string): string {
  const trimmed = siteTitle.trim();

  if (trimmed) {
    return trimmed;
  }

  return getMessages(locale).site.title;
}

export async function buildPageMetadata(
  locale: Locale,
  options: PageMetadataOptions = {},
): Promise<Metadata> {
  const settings = await getSiteSettings();
  const localized = localizeSiteSettings(settings, locale);
  const messages = getMessages(locale);

  const brand = getSiteBrandName(locale, localized.siteTitle);
  const siteDescription =
    localized.siteDescription.trim() || messages.site.description;
  const pageTitle = options.title?.trim();
  const description = options.description?.trim() || siteDescription;
  const fullTitle = pageTitle ? `${brand} | ${pageTitle}` : brand;

  const ogImagePath =
    options.ogImage?.trim() || localized.ogImage.trim() || undefined;
  const ogImageUrl = ogImagePath ? resolveOgImage(ogImagePath) : undefined;
  const faviconUrl = localized.favicon.trim()
    ? resolveMetadataImage(localized.favicon)
    : undefined;

  const keywords = localized.keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    metadataBase: getMetadataBaseUrl(),
    title: pageTitle
      ? fullTitle
      : {
          default: brand,
          template: `${brand} | %s`,
        },
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    ...(localized.author.trim()
      ? { authors: [{ name: localized.author.trim() }] }
      : {}),
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
    openGraph: {
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
      siteName: brand,
      title: fullTitle,
      description,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export async function getSiteBranding(locale: Locale) {
  const settings = await getSiteSettings();
  const localized = localizeSiteSettings(settings, locale);
  const brand = getSiteBrandName(locale, localized.siteTitle);
  const logoSrc = localized.logo.trim()
    ? getResponsiveImagePath(localized.logo, 372)
    : null;

  return {
    brand,
    logoSrc,
  };
}
