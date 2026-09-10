export function isPrismaSchemaMismatchError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  const code = (error as { code: string }).code;

  // P2021: table/view does not exist
  // P2022: column does not exist
  return code === 'P2021' || code === 'P2022';
}
