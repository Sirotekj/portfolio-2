const { loadEnvConfig } = require('@next/env');
const { resolve } = require('path');
const { Pool } = require('pg');

const { getDatabaseHost } = require('./lib/db-host.mjs');

loadEnvConfig(resolve(process.cwd()));

const secretB64 = process.env.ADMIN_SESSION_SECRET_B64?.trim() ?? '';
const secretPlain = process.env.ADMIN_SESSION_SECRET?.trim() ?? '';

async function main() {
  console.log('Loaded via Next.js (@next/env)\n');
  console.log('Database host:', getDatabaseHost(process.env.DATABASE_URL));
  console.log('ADMIN_SESSION_SECRET_B64 set:', Boolean(secretB64));
  console.log('ADMIN_SESSION_SECRET set:', Boolean(secretPlain));

  if (!secretB64 && !secretPlain) {
    console.log('\nChybí session secret. Spusť: npm run admin:generate-secret');
    process.exitCode = 1;
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.log('\nChybí DATABASE_URL.');
    process.exitCode = 1;
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const result = await pool.query(
      `SELECT email, created_at FROM users ORDER BY created_at ASC`,
    );

    console.log('\nAdmin users in DB:', result.rows.length);

    for (const user of result.rows) {
      console.log(`- ${user.email}`);
    }

    if (result.rows.length === 0) {
      console.log(
        '\nVytvoř uživatele: npm run admin:create-user -- email@example.com heslo',
      );
      process.exitCode = 1;
    }
  } catch (error) {
    if (error.code === '42P01') {
      console.log('\nTabulka users neexistuje. Spusť nejdřív: npm run db:migrate:deploy');
      process.exitCode = 1;
      return;
    }

    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
