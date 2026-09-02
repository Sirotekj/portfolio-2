import type { BlogFormData, BlogView } from '@/types/types';

import { saveResponsiveImages } from '@/lib/images/process-upload';
import { prisma } from '@/lib/prisma';

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

export async function saveBlogImage(file: File): Promise<string> {
  return saveResponsiveImages({
    file,
    folder: 'uploads/blog',
  });
}

export async function SaveBlog(
  blog: BlogFormData,
  image?: string,
): Promise<void> {
  await prisma.blogPost.create({
    data: {
      title: blog.title,
      titleEn: blog.titleEn,
      slug: blog.slug,
      slugEn: blog.slugEn,
      intro: blog.intro,
      introEn: blog.introEn,
      content: blog.content,
      contentEn: blog.contentEn,
      image: image ?? '',
      publishedAt: new Date(),
    },
  });
}

export async function UpdateBlog(
  blog: BlogFormData,
  image: string | undefined,
  id: string,
): Promise<void> {
  const existing = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
    select: { publishedAt: true },
  });

  await prisma.blogPost.update({
    where: { id: Number(id) },
    data: {
      title: blog.title,
      titleEn: blog.titleEn,
      slug: blog.slug,
      slugEn: blog.slugEn,
      intro: blog.intro,
      introEn: blog.introEn,
      content: blog.content,
      contentEn: blog.contentEn,
      ...(image !== undefined ? { image } : {}),
      ...(existing?.publishedAt == null ? { publishedAt: new Date() } : {}),
    },
  });
}

export async function DeleteBlog(id: string): Promise<void> {
  await prisma.blogPost.delete({
    where: { id: Number(id) },
  });
}

export async function GetBlogById(id: number): Promise<BlogView | null> {
  const blog = await prisma.blogPost.findUnique({ where: { id } });

  if (!blog) {
    return null;
  }

  return mapBlog(blog);
}

export async function GetAllBlogs(): Promise<BlogView[]> {
  const blogs = await prisma.blogPost.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return blogs.map(mapBlog);
}
