import 'server-only';

import bcrypt from 'bcryptjs';

import { findUserByEmail, normalizeUserEmail } from '@/lib/auth/users';

import { hasSessionSecretConfig } from './config';

/** Bcrypt hash of a throwaway password — used when the user does not exist. */
const INVALID_USER_PASSWORD_HASH =
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkNeZQ/UW.uSi';

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

  const normalizedEmail = normalizeUserEmail(email);
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    await bcrypt.compare(password, INVALID_USER_PASSWORD_HASH);
    return { ok: false };
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return { ok: false };
  }

  return { ok: true, email: user.email };
}
