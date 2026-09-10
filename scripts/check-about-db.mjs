import { config } from 'dotenv';
import { resolve } from 'path';
import { Pool } from 'pg';

const envFile =
  process.env.CHECK_ENV === 'production'
    ? '.env.production.local'
    : '.env.development.local';

config({ path: resolve(process.cwd(), envFile) });

const host = new URL(process.env.DATABASE_URL.replace(/^postgresql:/, 'http:')).hostname;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  console.log('Env file:', envFile);
  console.log('Host:', host);

  for (const table of ['hobbies', 'about_page']) {
    const cols = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name=$1 ORDER BY 1`,
      [table],
    );
    console.log(`${table} columns:`, cols.rows.map((r) => r.column_name).join(', '));
  }

  await pool.query('SELECT 1 FROM hobbies LIMIT 1');
  console.log('hobbies query: OK');
} catch (error) {
  console.error('FAILED:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
