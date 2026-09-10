const { loadEnvConfig } = require('@next/env');
const { resolve } = require('path');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/prisma/client.js');

loadEnvConfig(resolve(process.cwd()));

const secretB64 = process.env.ADMIN_SESSION_SECRET_B64?.trim() ?? '';
const secretPlain = process.env.ADMIN_SESSION_SECRET?.trim() ?? '';

async function main() {
  console.log('Loaded via Next.js (@next/env)\n');
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
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const users = await prisma.user.findMany({
      select: { email: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    console.log('\nAdmin users in DB:', users.length);

    for (const user of users) {
      console.log(`- ${user.email}`);
    }

    if (users.length === 0) {
      console.log('\nVytvoř uživatele: npm run admin:create-user -- email@example.com heslo');
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
