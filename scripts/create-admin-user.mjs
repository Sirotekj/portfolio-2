import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

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

function createUserId() {
  return randomBytes(16).toString('base64url');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const passwordHash = bcrypt.hashSync(passwordArg, rounds);
  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, email`,
    [createUserId(), email, passwordHash],
  );

  const user = result.rows[0];
  console.log(`Admin user ready: ${user.email} (${user.id})`);
  console.log(`Env file: ${envFile}`);
} catch (error) {
  console.error('Failed to create admin user:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
