import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production.local'
    : '.env.development.local';

config({ path: resolve(process.cwd(), envFile) });
config({ path: resolve(process.cwd(), '.env') });

const emailArg = process.argv[2];
const passwordArg = process.argv[3];
const rounds = 12;

if (!emailArg || !passwordArg) {
  console.error('Usage: npm run admin:create-user -- <email> <heslo>');
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();

if (!email.includes('@')) {
  console.error('Neplatný email.');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error(`Chybí DATABASE_URL v ${envFile}.`);
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  const passwordHash = bcrypt.hashSync(passwordArg, rounds);
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  console.log(`Admin user ready: ${user.email} (${user.id})`);
  console.log(`Env file: ${envFile}`);
} catch (error) {
  console.error('Failed to create admin user:', error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  await pool.end();
}
