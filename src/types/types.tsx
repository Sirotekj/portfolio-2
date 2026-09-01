import type { BlogPost } from '@/generated/prisma/client';

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
