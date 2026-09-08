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
  descriptionEn: string | null;
  category: ProjectCategory | Categories | null;
  gallery: string[];
  sortOrder: number;
};

export type ProjectFormData = Pick<
  ProjectView,
  'title' | 'titleEn' | 'description' | 'descriptionEn' | 'category'
>;

export type PortfolioPageView = {
  id: number;
  intro: string;
  introEn: string | null;
};

export type SiteSettingsFormData = {
  siteTitle: string;
  siteTitleEn: string | null;
  siteDescription: string;
  siteDescriptionEn: string | null;
  keywords: string;
  keywordsEn: string | null;
  author: string;
  contactHeader: string;
  contactHeaderEn: string | null;
  contactEmail: string;
  contactLocation: string;
  contactPhone: string;
  formHeader: string;
  formHeaderEn: string | null;
  formNameLabel: string;
  formNameLabelEn: string | null;
  formEmailLabel: string;
  formEmailLabelEn: string | null;
  formMessageLabel: string;
  formMessageLabelEn: string | null;
  formSubmitLabel: string;
  formSubmitLabelEn: string | null;
};

export type SiteSettingsView = SiteSettingsFormData & {
  id: number;
  favicon: string;
  logo: string;
  ogImage: string;
};

export type AboutPageView = {
  id: number;
  photo: string;
  intro: string;
  introEn: string | null;
};

export type HobbyView = {
  id: number;
  name: string;
  nameEn: string | null;
  sortOrder: number;
};

export type SkillView = {
  id: number;
  name: string;
  nameEn: string | null;
  level: number;
  sortOrder: number;
};

export type LanguageView = {
  id: number;
  name: string;
  nameEn: string | null;
  level: number;
  sortOrder: number;
};

export type EducationView = {
  id: number;
  years: string;
  school: string;
  schoolEn: string | null;
  sortOrder: number;
};

export type JobExperienceView = {
  id: number;
  years: string;
  description: string;
  descriptionEn: string | null;
  sortOrder: number;
};

export type AboutEditorData = {
  aboutPage: AboutPageView;
  skills: SkillView[];
  languages: LanguageView[];
  education: EducationView[];
  jobs: JobExperienceView[];
  hobbies: HobbyView[];
};
