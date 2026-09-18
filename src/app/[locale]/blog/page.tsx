import type { Metadata } from 'next';
import Link from 'next/link';

import ResponsiveImage from '@/components/responsive-image';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { localizedPath } from '@/i18n/routing';
import { getBlogLocalizedFields, getPublishedBlogs } from '@/lib/blog/queries';
import { buildPageMetadata } from '@/lib/site-settings/metadata';

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);

  return buildPageMetadata(locale, {
    title: messages.nav.blog,
  });
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const messages = getMessages(locale);
  const blogs = await getPublishedBlogs();

  return (
    <section className="page-section container">
      {blogs.length === 0 ? (
        <p className="page-empty">{messages.blog.empty}</p>
      ) : (
        <ul className="blog-list">
          {blogs.map((blog) => {
            const localized = getBlogLocalizedFields(blog, locale);

            return (
              <li key={blog.id}>
                <Link
                  href={localizedPath(locale, `/blog/${localized.slug}`)}
                  className="blog-card"
                >
                  {blog.image ? (
                    <div className="blog-card__media">
                      <ResponsiveImage
                        basePath={blog.image}
                        alt={localized.title}
                        fill
                        sizes="(min-width: 768px) 280px, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="blog-card__body">
                    <h2 className="blog-card__title">{localized.title}</h2>
                    <p className="page-muted">{localized.intro}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
