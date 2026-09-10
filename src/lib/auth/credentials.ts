import 'server-only';

import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';

import { findUserByEmail, normalizeUserEmail } from '@/lib/auth/users';

import { hasSessionSecretConfig } from './config';

/** Bcrypt hash of a throwaway password — used when the user does not exist. */
const INVALID_USER_PASSWORD_HASH =
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkNeZQ/UW.uSi';

function emailsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(normalizeUserEmail(input));
  const b = Buffer.from(normalizeUserEmail(expected));

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export type AdminLoginResult =
  | { ok: true; email: string }
  | { ok: false };

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AdminLoginResult> {
  if (!hasSessionSecretConfig()) {
    return { ok: false };
  }

  const user = await findUserByEmail(email);
  const passwordHash = user?.passwordHash ?? INVALID_USER_PASSWORD_HASH;
  const passwordMatches = await bcrypt.compare(password, passwordHash);

  if (!user || !passwordMatches || !emailsMatch(email, user.email)) {
    return { ok: false };
  }

  return { ok: true, email: user.email };
}
