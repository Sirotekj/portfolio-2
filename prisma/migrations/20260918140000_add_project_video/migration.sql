-- AlterTable
ALTER TABLE "projects" ADD COLUMN "video" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "video_width" INTEGER;
ALTER TABLE "projects" ADD COLUMN "video_height" INTEGER;
