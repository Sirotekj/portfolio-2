import 'server-only';

import {
  getAdminEmailValue,
  getAdminSessionSecretValue,
} from './env-shared';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$/;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function decodeBase64Env(name: string): string | null {
  const encoded = process.env[name]?.trim();

  if (!encoded) {
    return null;
  }

  return Buffer.from(encoded, 'base64').toString('utf8');
}

export function getAdminEmail(): string {
  return getAdminEmailValue() ?? requireEnv('ADMIN_EMAIL');
}

export function getAdminPasswordHash(): string {
  const fromBase64 = decodeBase64Env('ADMIN_PASSWORD_HASH_B64');

  if (fromBase64) {
    if (!BCRYPT_HASH_PATTERN.test(fromBase64)) {
      throw new Error(
        'ADMIN_PASSWORD_HASH_B64 is invalid. Regenerate it with npm run admin:hash-password.',
      );
    }

    return fromBase64;
  }

  const hash = requireEnv('ADMIN_PASSWORD_HASH');

  if (!BCRYPT_HASH_PATTERN.test(hash)) {
    throw new Error(
      'ADMIN_PASSWORD_HASH is corrupted by Next.js env parsing ($ expansion). Use ADMIN_PASSWORD_HASH_B64 from npm run admin:hash-password.',
    );
  }

  return hash;
}

export function getAdminSessionSecret(): Uint8Array {
  const secret =
    getAdminSessionSecretValue() ?? requireEnv('ADMIN_SESSION_SECRET');

  return new TextEncoder().encode(secret);
}

export function hasAdminAuthConfig(): boolean {
  const hasPassword = Boolean(
    process.env.ADMIN_PASSWORD_HASH_B64?.trim() ||
      process.env.ADMIN_PASSWORD_HASH?.trim(),
  );

  const hasSecret = Boolean(
    process.env.ADMIN_SESSION_SECRET_B64?.trim() ||
      process.env.ADMIN_SESSION_SECRET?.trim(),
  );

  return Boolean(process.env.ADMIN_EMAIL?.trim() && hasPassword && hasSecret);
}

export function getAdminAuthSetupError(): string | null {
  if (!process.env.ADMIN_EMAIL?.trim()) {
    return 'Chybí ADMIN_EMAIL.';
  }

  if (
    !process.env.ADMIN_PASSWORD_HASH_B64?.trim() &&
    !process.env.ADMIN_PASSWORD_HASH?.trim()
  ) {
    return 'Chybí ADMIN_PASSWORD_HASH_B64 (doporučeno) nebo ADMIN_PASSWORD_HASH.';
  }

  if (
    !process.env.ADMIN_SESSION_SECRET_B64?.trim() &&
    !process.env.ADMIN_SESSION_SECRET?.trim()
  ) {
    return 'Chybí ADMIN_SESSION_SECRET_B64 (doporučeno) nebo ADMIN_SESSION_SECRET.';
  }

  try {
    getAdminPasswordHash();
  } catch (error) {
    return error instanceof Error
      ? error.message
      : 'ADMIN_PASSWORD_HASH má neplatný formát.';
  }

  return null;
}
