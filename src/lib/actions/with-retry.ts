import { isPrismaSchemaMismatchError } from '@/lib/prisma/errors';

const RETRYABLE_PRISMA_CODES = new Set([
  'P1001',
  'P1002',
  'P1008',
  'P1017',
  'P2024',
]);

function shouldRetry(error: unknown, retriesLeft: number): boolean {
  if (retriesLeft <= 0) {
    return false;
  }

  if (isPrismaSchemaMismatchError(error)) {
    return false;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    return RETRYABLE_PRISMA_CODES.has((error as { code: string }).code);
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
