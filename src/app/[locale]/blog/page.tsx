import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getBlogs } from '@/data/dummy-blog';
import { isValidLocale, type Locale } from '@/i18n/config';
import { localizedPath } from '@/i18n/routing';

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Blog',
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = isValidLocale(localeParam) ? localeParam : 'cs';
  const blogs = getBlogs();

  return (
    <section className="container my-xlarge">
      <ul className="flex flex-col gap-large">
        {blogs.map((blog) => (
          <li key={blog.slug}>
            <Link
              href={localizedPath(locale, `/blog/${blog.slug}`)}
              className="group grid min-h-48 grid-cols-1 overflow-hidden rounded-xl border border-border shadow-xl transition-colors hover:border-primary md:grid-cols-[280px_1fr]"
            >
              {blog.image ? (
                <div className="relative aspect-video w-full max-w-full overflow-hidden md:aspect-auto md:h-full md:min-h-0">
                  <Image
                    src={`/${blog.image}`}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 280px, 100vw"
                  />
                </div>
              ) : null}
              <div className="min-w-0 px-large py-medium">
                <h2 className="mt-0 mb-small text-primary group-hover:underline">
                  {blog.title}
                </h2>
                <p className="text-light">{blog.intro}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
