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
    return { title: messages.blog.notFound };
  }

  const localized = getBlogLocalizedFields(blog, locale);

  return {
    title: localized.title,
    description: localized.intro,
  };
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
    <article className="small-container my-xlarge">
      <Link
        href={localizedPath(locale, '/blog')}
        className="mb-medium inline-block text-primary hover:underline"
      >
        {messages.blog.back}
      </Link>

      <header className="mb-large">
        <h1 className="text-center font-bold tracking-tight text-foreground">
          {localized.title}
        </h1>
        <p className="text-center text-xl sm:text-2xl italic mt-small text-light">
          {localized.intro}
        </p>
      </header>

      <BlogContent html={localized.content} />
    </article>
  );
}
