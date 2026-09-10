-- CreateTable
CREATE TABLE "hobbies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hobbies_pkey" PRIMARY KEY ("id")
);

-- Migrate existing comma-separated hobbies from about_page
INSERT INTO "hobbies" ("name", "name_en", "sortOrder")
SELECT
    TRIM(hobby.name),
    NULL,
    (hobby.idx - 1)::INTEGER
FROM "about_page" ap
CROSS JOIN LATERAL unnest(
  CASE
    WHEN ap."hobbies" IS NULL OR TRIM(ap."hobbies") = '' THEN ARRAY[]::TEXT[]
    ELSE regexp_split_to_array(ap."hobbies", '\s*,\s*')
  END
) WITH ORDINALITY AS hobby(name, idx)
WHERE ap."id" = 1
  AND TRIM(hobby.name) <> '';

-- DropColumn
ALTER TABLE "about_page" DROP COLUMN "hobbies";
