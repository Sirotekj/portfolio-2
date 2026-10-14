import { isPrismaSchemaMismatchError } from '@/lib/prisma/errors';

function shouldRetry(error: unknown, retriesLeft: number): boolean {
  if (retriesLeft <= 0) {
    return false;
  }

  // Chybějící tabulka/sloupec — retry jen zpomalí a stejně selže
  if (isPrismaSchemaMismatchError(error)) {
    return false;
  }

  return true;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (!shouldRetry(error, retries)) {
      throw error;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });

    return withRetry(fn, retries - 1, delayMs);
  }
}
