import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'prisma/config';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production.local'
    : '.env.development.local';

config({ path: resolve(process.cwd(), envFile) });
config({ path: resolve(process.cwd(), '.env') });

/** Prisma Migrate needs a direct DB connection (Neon pooler breaks advisory locks). */
function getMigrationDatabaseUrl(): string | undefined {
  const direct =
    process.env.DIRECT_URL?.trim() ||
    process.env.DATABASE_URL_UNPOOLED?.trim();

  if (direct) {
    return direct;
  }

  const pooled = process.env.DATABASE_URL?.trim();

  if (!pooled) {
    return undefined;
  }

  // Neon pooled host: ep-xxx-pooler.region... → ep-xxx.region...
  if (pooled.includes('-pooler.')) {
    return pooled.replace('-pooler.', '.');
  }

  return pooled;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: getMigrationDatabaseUrl(),
  },
});
