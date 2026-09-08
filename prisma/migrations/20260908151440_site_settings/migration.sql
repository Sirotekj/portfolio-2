/*
  Warnings:

  - You are about to drop the column `sort_order` on the `hobbies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hobbies" DROP COLUMN "sort_order",
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
