import 'server-only';

import { countAdminUsers } from '@/lib/auth/users';

import { getAdminSessionSecretValue } from './env-shared';

export function getAdminSessionSecret(): Uint8Array {
  const secret = getAdminSessionSecretValue();

  if (!secret) {
    throw new Error(
      'Missing ADMIN_SESSION_SECRET_B64 (or ADMIN_SESSION_SECRET). Generate with: npm run admin:generate-secret',
    );
  }

  return new TextEncoder().encode(secret);
}

export function hasSessionSecretConfig(): boolean {
  return Boolean(getAdminSessionSecretValue());
}

export function getSessionSecretSetupError(): string | null {
  if (!hasSessionSecretConfig()) {
    return 'Chybí ADMIN_SESSION_SECRET_B64 (doporučeno) nebo ADMIN_SESSION_SECRET. Vygeneruj: npm run admin:generate-secret';
  }

  return null;
}

export async function getAdminAuthSetupError(): Promise<string | null> {
  const secretError = getSessionSecretSetupError();

  if (secretError) {
    return secretError;
  }

  const userCount = await countAdminUsers();

  if (userCount === 0) {
    return 'V databázi není žádný admin uživatel. Vytvoř ho: npm run admin:create-user:dev -- email@example.com heslo';
  }

  return null;
}

export async function isAdminLoginReady(): Promise<boolean> {
  return (await getAdminAuthSetupError()) === null;
}
