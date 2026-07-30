import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/data/dummy-blog';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getBlogs().map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return { title: 'Článek nenalezen' };
  }

  return {
    title: blog.title,
    description: blog.intro,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="small-container my-xlarge">
      <div className=""></div>
      <Link
        href="/blog"
        className="mb-medium inline-block text-primary hover:underline"
      >
        ← Zpět na blog
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
