const { loadEnvConfig } = require('@next/env');
const { resolve } = require('path');
const bcrypt = require('bcryptjs');

loadEnvConfig(resolve(process.cwd()));

const email = process.env.ADMIN_EMAIL?.trim() ?? '';
const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64?.trim() ?? '';
const hashPlain = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';
const secretB64 = process.env.ADMIN_SESSION_SECRET_B64?.trim() ?? '';
const secretPlain = process.env.ADMIN_SESSION_SECRET?.trim() ?? '';
const password = process.argv[2];

const hashFromB64 = hashB64
  ? Buffer.from(hashB64, 'base64').toString('utf8')
  : '';
const hash = hashFromB64 || hashPlain;
const hashValid = /^\$2[aby]\$/.test(hash);

console.log('Loaded via Next.js (@next/env) — stejně jako běžící aplikace\n');
console.log('ADMIN_EMAIL set:', Boolean(email));
console.log('ADMIN_PASSWORD_HASH_B64 set:', Boolean(hashB64));
console.log('ADMIN_PASSWORD_HASH set:', Boolean(hashPlain));
console.log('ADMIN_SESSION_SECRET_B64 set:', Boolean(secretB64));
console.log('ADMIN_SESSION_SECRET set:', Boolean(secretPlain));
console.log('Resolved hash length:', hash.length, '| valid bcrypt prefix:', hashValid);

if (hashPlain && !hashB64 && !hashValid) {
  console.log('\n⚠ ADMIN_PASSWORD_HASH je poškozený (typická chyba Next.js + $ v .env).');
  console.log('   Použij ADMIN_PASSWORD_HASH_B64 z: npm run admin:hash-password -- <heslo>');
}

if (!hashB64 && hashValid) {
  console.log('\nTip: pro spolehlivost migruj na ADMIN_PASSWORD_HASH_B64.');
}

if (password && hashValid) {
  const ok = bcrypt.compareSync(password, hash);
  console.log('\nPassword test:', ok ? 'OK ✓' : 'FAIL ✗');
}

if (!hashValid) {
  process.exitCode = 1;
}
