import type { BlogPost, ProjectCategory } from '@/generated/prisma/client';

export type FormState = {
  messages: string[];
  errors: string[];
};

export type Categories = 'print' | 'digital' | 'personal' | 'logo';

export type BlogFormData = Pick<
  BlogPost,
  | 'title'
  | 'titleEn'
  | 'slug'
  | 'slugEn'
  | 'intro'
  | 'introEn'
  | 'content'
  | 'contentEn'
>;

export type BlogView = BlogFormData & {
  id: number;
  image: string;
  publishedAt: Date | null;
};

export type ProjectView = {
  id: number;
  title: string;
  titleEn: string | null;
  image: string;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string;
  category: ProjectCategory | Categories | null;
  gallery: string[];
  sortOrder: number;
};

export type ProjectFormData = Pick<
  ProjectView,
  'title' | 'titleEn' | 'description' | 'category'
>;
