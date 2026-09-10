import 'server-only';

import { prisma } from '@/lib/prisma';
import { isPrismaSchemaMismatchError } from '@/lib/prisma/errors';

export function normalizeUserEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email: normalizeUserEmail(email) },
    });
  } catch (error) {
    if (isPrismaSchemaMismatchError(error)) {
      return null;
    }

    throw error;
  }
}

export async function countAdminUsers(): Promise<number> {
  try {
    return await prisma.user.count();
  } catch (error) {
    if (isPrismaSchemaMismatchError(error)) {
      return 0;
    }

    throw error;
  }
}
