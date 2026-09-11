import { Pool } from 'pg';

import { getDatabaseHost } from './lib/db-host.mjs';
import { loadProjectEnv } from './lib/load-env.mjs';

const targetArg = process.argv[2];

if (targetArg !== 'dev' && targetArg !== 'prod') {
  console.error('Usage: npm run admin:verify-auth:dev');
  console.error('       npm run admin:verify-auth:prod');
  process.exit(1);
}

const { envFile, target } = loadProjectEnv(targetArg);

const secretB64 = process.env.ADMIN_SESSION_SECRET_B64?.trim() ?? '';
const secretPlain = process.env.ADMIN_SESSION_SECRET?.trim() ?? '';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log(`Target: ${target} (${envFile})`);
  console.log('Database host:', getDatabaseHost(process.env.DATABASE_URL));
  console.log('ADMIN_SESSION_SECRET_B64 set:', Boolean(secretB64));
  console.log('ADMIN_SESSION_SECRET set:', Boolean(secretPlain));

  if (!secretB64 && !secretPlain) {
    console.log('\nChybí session secret. Spusť: npm run admin:generate-secret');
    process.exitCode = 1;
  } else if (!process.env.DATABASE_URL) {
    console.log('\nChybí DATABASE_URL.');
    process.exitCode = 1;
  } else {
    const result = await pool.query(
      `SELECT email, created_at FROM users ORDER BY created_at ASC`,
    );

    console.log('\nAdmin users in DB:', result.rows.length);

    for (const user of result.rows) {
      console.log(`- ${user.email}`);
    }

    if (result.rows.length === 0) {
      console.log(
        `\nVytvoř uživatele: npm run admin:create-user:${target} -- email@example.com heslo`,
      );
      process.exitCode = 1;
    }
  }
} catch (error) {
  if (error.code === '42P01') {
    console.log('\nTabulka users neexistuje. Spusť nejdřív: npm run db:migrate:deploy');
    process.exitCode = 1;
  } else {
    console.error(error);
    process.exitCode = 1;
  }
} finally {
  await pool.end();
}
