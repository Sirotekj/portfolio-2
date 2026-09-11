import { randomBytes } from 'crypto';

const sessionSecret = randomBytes(32).toString('base64');
const sessionSecretBase64 = Buffer.from(sessionSecret, 'utf8').toString('base64');

console.log('\nVlož do .env.development.local a .env.production.local:\n');
console.log(`ADMIN_SESSION_SECRET_B64="${sessionSecretBase64}"`);
console.log('\nOdstraň staré ADMIN_EMAIL, ADMIN_PASSWORD_HASH* — uživatelé jsou v DB.');
console.log('Uživatele vytvoř: npm run admin:create-user:dev -- email@example.com heslo');
console.log('\nPo úpravě .env restartuj dev server (npm run dev).');
