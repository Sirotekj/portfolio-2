import 'server-only';

import bcrypt from 'bcryptjs';
import { timingSafeEqual } from 'crypto';

import {
  getAdminEmail,
  getAdminPasswordHash,
  hasAdminAuthConfig,
} from './config';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function emailsMatch(input: string, expected: string): boolean {
  const a = Buffer.from(normalizeEmail(input));
  const b = Buffer.from(normalizeEmail(expected));

  if (a.length !== b.length) {
    return false;
  }

  return timingSafeEqual(a, b);
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  if (!hasAdminAuthConfig()) {
    return false;
  }

  const expectedEmail = getAdminEmail();
  const passwordHash = getAdminPasswordHash();

  if (!emailsMatch(email, expectedEmail)) {
    // Same work as failed password check to avoid timing leaks.
    await bcrypt.compare(password, passwordHash);
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}
