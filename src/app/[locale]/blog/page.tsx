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
    <section className="container my-xlarge">
      {blogs.length === 0 ? (
        <p className="text-center text-light">{messages.blog.empty}</p>
      ) : (
        <ul className="flex flex-col gap-large">
          {blogs.map((blog) => {
            const localized = getBlogLocalizedFields(blog, locale);

            return (
              <li key={blog.id}>
                <Link
                  href={localizedPath(locale, `/blog/${localized.slug}`)}
                  className="group grid min-h-48 grid-cols-1 overflow-hidden rounded-xl border border-border shadow-xl transition-colors hover:border-primary/50 md:grid-cols-[280px_1fr]"
                >
                  {blog.image ? (
                    <div className="relative aspect-video w-full max-w-full overflow-hidden md:aspect-auto md:h-full md:min-h-0">
                      <ResponsiveImage
                        basePath={blog.image}
                        alt={localized.title}
                        fill
                        sizes="(min-width: 768px) 280px, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 px-large py-medium">
                    <h2 className="mt-0 mb-small text-foreground">
                      {localized.title}
                    </h2>
                    <p className="text-light">{localized.intro}</p>
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
