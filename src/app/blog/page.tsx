import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs } from '@/data/dummy-blog';

export const metadata: Metadata = {
  title: 'Blog',
};

export default function BlogPage() {
  const blogs = getBlogs();

  return (
    <section className="container my-xlarge">
      <ul className="flex flex-col gap-large">
        {blogs.map((blog) => (
          <li key={blog.slug}>
            <Link
              href={`/blog/${blog.slug}`}
              className="group grid min-h-48 overflow-hidden rounded-xl border border-border shadow-xl transition-colors hover:border-primary md:grid-cols-[auto_1fr]"
            >
              {blog.image ? (
                <div className="relative aspect-video w-full md:h-full md:w-auto md:aspect-video">
                  <Image
                    src={`/${blog.image}`}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 320px, 100vw"
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
