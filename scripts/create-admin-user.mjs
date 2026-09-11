import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Pool } from 'pg';

import { getDatabaseHost } from './lib/db-host.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const targetArg = process.argv[2];
const emailArg = process.argv[3];
const passwordArg = process.argv[4];
const rounds = 12;

if (targetArg !== 'dev' && targetArg !== 'prod') {
  console.error('Usage: npm run admin:create-user:dev -- <email> <heslo>');
  console.error('       npm run admin:create-user:prod -- <email> <heslo>');
  process.exit(1);
}

if (!emailArg || !passwordArg) {
  console.error('Usage: npm run admin:create-user:dev -- <email> <heslo>');
  process.exit(1);
}

const { envFile, target } = loadProjectEnv(targetArg);

const email = emailArg.trim().toLowerCase();

if (!email.includes('@')) {
  console.error('Neplatný email.');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error(`Chybí DATABASE_URL v ${envFile}.`);
  process.exit(1);
}

const databaseHost = getDatabaseHost(process.env.DATABASE_URL);

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

  const verify = await pool.query(
    `SELECT id, email FROM users WHERE email = $1`,
    [email],
  );

  const allUsers = await pool.query(
    `SELECT email FROM users ORDER BY email ASC`,
  );

  const user = result.rows[0];

  console.log(`Target: ${target} (${envFile})`);
  console.log(`Database host: ${databaseHost}`);
  console.log(`Admin user ready: ${user.email} (${user.id})`);
  console.log(`Verified in DB: ${verify.rows.length === 1 ? 'yes' : 'NO'}`);
  console.log(`All users on this host (${allUsers.rows.length}):`);

  for (const row of allUsers.rows) {
    console.log(`- ${row.email}`);
  }

  console.log(
    `\nOtevři stejnou DB ve Studiu: npm run db:studio:${target}`,
  );

  if (verify.rows.length !== 1) {
    process.exitCode = 1;
  }
} catch (error) {
  console.error('Failed to create admin user:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
