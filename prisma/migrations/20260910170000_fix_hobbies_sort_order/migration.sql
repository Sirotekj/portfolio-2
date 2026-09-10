-- Align hobbies.sortOrder with Prisma schema (older deploys used sort_order).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hobbies'
      AND column_name = 'sort_order'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hobbies'
      AND column_name = 'sortOrder'
  ) THEN
    ALTER TABLE "hobbies" RENAME COLUMN "sort_order" TO "sortOrder";
  END IF;
END $$;
