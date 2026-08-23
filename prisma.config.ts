import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'prisma/config';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production.local'
    : '.env.development.local';

config({ path: resolve(process.cwd(), envFile) });
config({ path: resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
