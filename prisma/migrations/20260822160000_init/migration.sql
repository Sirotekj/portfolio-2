-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('print', 'digital', 'personal', 'logo');

-- CreateTable
CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "contactHeader" TEXT NOT NULL DEFAULT 'Kontakt',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "contactLocation" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "formHeader" TEXT NOT NULL DEFAULT 'Kontaktní formulář',
    "formNameLabel" TEXT NOT NULL DEFAULT 'Jméno',
    "formEmailLabel" TEXT NOT NULL DEFAULT 'Váš mail',
    "formMessageLabel" TEXT NOT NULL DEFAULT 'Zpráva',
    "formSubmitLabel" TEXT NOT NULL DEFAULT 'Odeslat',

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_page" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "photo" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL,
    "hobbies" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "about_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "years" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_experiences" (
    "id" SERIAL NOT NULL,
    "years" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_page" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "intro" TEXT NOT NULL,

    CONSTRAINT "portfolio_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" "ProjectCategory",
    "gallery" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "intro" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
