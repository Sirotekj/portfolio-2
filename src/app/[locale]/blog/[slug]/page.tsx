import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBlogBySlug, getBlogs } from '@/data/dummy-blog';
import { locales, isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { localizedPath } from '@/i18n/routing';

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBlogs().map((blog) => ({ locale, slug: blog.slug })),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const blog = getBlogBySlug(slug);
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);

  if (!blog) {
    return { title: messages.blog.notFound };
  }

  return {
    title: blog.title,
    description: blog.intro,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug, locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="small-container my-xlarge">
      <div className=""></div>
      <Link
        href={localizedPath(locale, '/blog')}
        className="mb-medium inline-block text-primary hover:underline"
      >
        {messages.blog.back}
      </Link>

      <header className="mb-large">
        <h1 className="text-center font-bold tracking-tight text-foreground">
          {blog.title}
        </h1>
        <p className="text-center text-xl sm:text-2xl italic mt-small text-light">
          {blog.intro}
        </p>
      </header>

      <div className="flex flex-col gap-medium text-foreground">
        {blog.text}
      </div>
    </article>
  );
}
