import type { Locale } from '@/i18n/config';

export type BlogTranslatableFields = {
  slug: string;
  slugEn: string | null;
  title: string;
  titleEn: string | null;
  intro: string;
  introEn: string | null;
  content: string;
  contentEn: string | null;
};

export type BlogLocalizedFields = {
  slug: string;
  title: string;
  intro: string;
  content: string;
};

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

export function getBlogLocalizedFields(
  blog: BlogTranslatableFields,
  locale: Locale,
): BlogLocalizedFields {
  return {
    slug:
      locale === 'en' && blog.slugEn?.trim() ? blog.slugEn.trim() : blog.slug,
    title: pickLocalized(blog.title, blog.titleEn, locale),
    intro: pickLocalized(blog.intro, blog.introEn, locale),
    content: pickLocalized(blog.content, blog.contentEn, locale),
  };
}

export function getBlogPublicPath(
  blog: BlogTranslatableFields,
  locale: Locale,
): string {
  return `/blog/${getBlogLocalizedFields(blog, locale).slug}`;
}
