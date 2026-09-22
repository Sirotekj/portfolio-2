const PORTFOLIO_PREFIX = 'uploads/portfolio';

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isPortfolioBlobPath(storedPath: string): boolean {
  const normalized = storedPath.trim();

  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://')
  ) {
    return (
      normalized.includes('blob.vercel-storage.com') &&
      normalized.includes(PORTFOLIO_PREFIX)
    );
  }

  const pathname = normalized.replace(/^\/+/, '');

  if (!pathname.startsWith(PORTFOLIO_PREFIX)) {
    return false;
  }

  return isBlobStorageEnabled();
}

export function getBlobPublicBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL?.trim() ||
    process.env.BLOB_PUBLIC_BASE_URL?.trim();

  if (!base) {
    throw new Error(
      'Chybí NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL (nebo BLOB_PUBLIC_BASE_URL). Zkopíruj veřejnou URL Blob store z Vercelu.',
    );
  }

  return base.replace(/\/$/, '');
}

export function blobPublicUrl(pathname: string): string {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname;
  }

  return `${getBlobPublicBaseUrl()}/${pathname.replace(/^\/+/, '')}`;
}

export async function putBlob(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<{ url: string; pathname: string }> {
  const { put } = await import('@vercel/blob');

  return put(pathname, body, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    contentType,
  });
}

export async function deleteBlobUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) {
    return;
  }

  const { del } = await import('@vercel/blob');

  await del(urls, { token: process.env.BLOB_READ_WRITE_TOKEN });
}
