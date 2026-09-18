import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BlogContent from '@/components/blog-content';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { localizedPath } from '@/i18n/routing';
import { getBlogLocalizedFields } from '@/lib/blog/localize';
import {
  getPublishedBlogBySlug,
  getPublishedBlogStaticParams,
} from '@/lib/blog/queries';
import { buildPageMetadata } from '@/lib/site-settings/metadata';

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedBlogStaticParams();
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const blog = await getPublishedBlogBySlug(slug, locale);

  if (!blog) {
    return buildPageMetadata(locale, {
      title: messages.blog.notFound,
    });
  }

  const localized = getBlogLocalizedFields(blog, locale);

  return buildPageMetadata(locale, {
    title: localized.title,
    description: localized.intro,
    ogImage: blog.image.trim() || undefined,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const blog = await getPublishedBlogBySlug(slug, locale);

  if (!blog) {
    notFound();
  }

  const localized = getBlogLocalizedFields(blog, locale);

  return (
    <article className="blog-post small-container">
      <Link
        href={localizedPath(locale, '/blog')}
        className="blog-post__back"
      >
        {messages.blog.back}
      </Link>

      <header className="blog-post__header">
        <h1 className="blog-post__title">{localized.title}</h1>
        <p className="blog-post__intro">{localized.intro}</p>
      </header>

      <BlogContent html={localized.content} />
    </article>
  );
}
