import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const password = process.argv[2];
const rounds = 12;

if (!password) {
  console.error('Usage: npm run admin:hash-password -- <heslo>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, rounds);
const hashBase64 = Buffer.from(hash, 'utf8').toString('base64');
const sessionSecret = randomBytes(32).toString('base64');
const sessionSecretBase64 = Buffer.from(sessionSecret, 'utf8').toString('base64');

console.log('\nVlož do .env.development.local a .env.production.local:\n');
console.log('ADMIN_EMAIL="tvuj@email.cz"');
console.log(`ADMIN_PASSWORD_HASH_B64="${hashBase64}"`);
console.log(`ADMIN_SESSION_SECRET_B64="${sessionSecretBase64}"`);
console.log('\n(Odstraň staré ADMIN_PASSWORD_HASH a ADMIN_SESSION_SECRET — Next.js');
console.log(' poškozuje hodnoty se znaky $ a uvozovkami v .env souborech.)');
console.log('\nPo úpravě .env restartuj dev server (npm run dev).');
