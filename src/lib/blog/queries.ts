import type { BlogView } from '@/types/types';

import type { Locale } from '@/i18n/config';
import { getBlogLocalizedFields } from '@/lib/blog/localize';
import { prisma } from '@/lib/prisma';

const publishedWhere = {
  publishedAt: {
    not: null,
    lte: new Date(),
  },
} as const;

function isMissingBlogTableError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2021'
  );
}

function mapBlog(blog: {
  id: number;
  title: string;
  titleEn: string | null;
  slug: string;
  slugEn: string | null;
  intro: string;
  introEn: string | null;
  content: string;
  contentEn: string | null;
  image: string;
  publishedAt: Date | null;
}): BlogView {
  return {
    id: blog.id,
    title: blog.title,
    titleEn: blog.titleEn,
    slug: blog.slug,
    slugEn: blog.slugEn,
    intro: blog.intro,
    introEn: blog.introEn,
    content: blog.content,
    contentEn: blog.contentEn,
    image: blog.image,
    publishedAt: blog.publishedAt,
  };
}

function publishedSlugWhere(slug: string, locale: Locale) {
  if (locale === 'en') {
    return {
      OR: [{ slugEn: slug }, { slug, slugEn: null }],
    };
  }

  return { slug };
}

export async function getPublishedBlogs(): Promise<BlogView[]> {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: publishedWhere,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return blogs.map(mapBlog);
  } catch (error) {
    if (isMissingBlogTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPublishedBlogBySlug(
  slug: string,
  locale: Locale,
): Promise<BlogView | null> {
  try {
    const blog = await prisma.blogPost.findFirst({
      where: {
        ...publishedWhere,
        ...publishedSlugWhere(slug, locale),
      },
    });

    return blog ? mapBlog(blog) : null;
  } catch (error) {
    if (isMissingBlogTableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getPublishedBlogStaticParams(): Promise<
  Array<{ locale: Locale; slug: string }>
> {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: publishedWhere,
      select: { slug: true, slugEn: true },
      orderBy: [{ publishedAt: 'desc' }],
    });

    const params: Array<{ locale: Locale; slug: string }> = [];

    for (const blog of blogs) {
      params.push({ locale: 'cs', slug: blog.slug });

      params.push({
        locale: 'en',
        slug: blog.slugEn?.trim() ? blog.slugEn.trim() : blog.slug,
      });
    }

    return params;
  } catch (error) {
    if (isMissingBlogTableError(error)) {
      return [];
    }

    throw error;
  }
}

export { getBlogLocalizedFields };
