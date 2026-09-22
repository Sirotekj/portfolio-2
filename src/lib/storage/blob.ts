const PORTFOLIO_PATH_SEGMENT = 'uploads/portfolio';

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isRunningOnVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

/** Na Vercelu vždy Blob; bez tokenu raději chyba než zápis do public/. */
export function shouldUseBlobStorage(): boolean {
  if (isBlobStorageEnabled()) {
    return true;
  }

  if (isRunningOnVercel()) {
    throw new Error(
      'Chybí BLOB_READ_WRITE_TOKEN. V Vercelu propoj Blob store s projektem (Storage → Blob → Connections), nebo token doplň do env pro Preview/Production.',
    );
  }

  return false;
}

/** development/ nebo production/ — podle Vercel prostředí, nebo BLOB_STORE_PREFIX. */
export function getBlobStorePrefix(): string {
  const explicit = process.env.BLOB_STORE_PREFIX?.trim();

  if (explicit) {
    return explicit.endsWith('/') ? explicit : `${explicit}/`;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return 'production/';
  }

  return 'development/';
}

/** Vercel env pull dává store_ prefix; CDN host používá id bez něj. */
export function normalizeBlobStoreIdForHost(storeId: string): string {
  const trimmed = storeId.trim();
  return trimmed.replace(/^store_/i, '');
}

function normalizeBlobPublicHostname(hostname: string): string {
  const [subdomain, ...rest] = hostname.split('.');

  if (!subdomain || rest.length === 0) {
    return hostname;
  }

  return `${normalizeBlobStoreIdForHost(subdomain)}.${rest.join('.')}`;
}

export function resolveBlobPublicBaseUrl(): string | null {
  const explicit =
    process.env.NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL?.trim() ||
    process.env.BLOB_PUBLIC_BASE_URL?.trim();

  if (explicit) {
    try {
      const parsed = new URL(explicit.replace(/\/$/, ''));
      parsed.hostname = normalizeBlobPublicHostname(parsed.hostname);
      return parsed.origin;
    } catch {
      return explicit.replace(/\/$/, '');
    }
  }

  const storeId = process.env.BLOB_STORE_ID?.trim();

  if (storeId) {
    const hostId = normalizeBlobStoreIdForHost(storeId);
    return `https://${hostId}.public.blob.vercel-storage.com`;
  }

  return null;
}

export function withBlobStorePrefix(pathname: string): string {
  const normalized = pathname.replace(/^\/+/, '');
  const prefix = getBlobStorePrefix();

  if (normalized.startsWith(prefix)) {
    return normalized;
  }

  return `${prefix}${normalized}`;
}

function hasBlobStorePrefix(pathname: string): boolean {
  const explicit = process.env.BLOB_STORE_PREFIX?.trim();

  if (explicit) {
    const normalizedPrefix = explicit.endsWith('/') ? explicit : `${explicit}/`;
    return pathname.startsWith(normalizedPrefix);
  }

  return (
    pathname.startsWith('development/') || pathname.startsWith('production/')
  );
}

/** Pouze cesty nahrané do Blob (prefix development/ nebo production/). Staré uploads/portfolio/… jsou lokální. */
export function isPortfolioBlobPath(storedPath: string): boolean {
  const normalized = storedPath.trim();

  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://')
  ) {
    return (
      normalized.includes('blob.vercel-storage.com') &&
      normalized.includes(PORTFOLIO_PATH_SEGMENT)
    );
  }

  const pathname = normalized.replace(/^\/+/, '');

  if (!pathname.includes(PORTFOLIO_PATH_SEGMENT)) {
    return false;
  }

  return hasBlobStorePrefix(pathname);
}

export function getBlobPublicBaseUrl(): string {
  const base = resolveBlobPublicBaseUrl();

  if (!base) {
    throw new Error(
      'Chybí veřejná URL Blob store. Nastav NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL, nebo propoj Blob store s projektem (Vercel doplní BLOB_STORE_ID).',
    );
  }

  return base;
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
  if (!isBlobStorageEnabled()) {
    throw new Error('BLOB_READ_WRITE_TOKEN není nastavený.');
  }

  const { put } = await import('@vercel/blob');
  const blobPath = withBlobStorePrefix(pathname);

  return put(blobPath, body, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: false,
    contentType,
  });
}

export async function deleteBlobUrls(urls: string[]): Promise<void> {
  if (urls.length === 0 || !isBlobStorageEnabled()) {
    return;
  }

  const { del } = await import('@vercel/blob');

  try {
    await del(urls, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (error) {
    console.warn(
      '[blob] Smazání souborů se nezdařilo (pokračuji):',
      error instanceof Error ? error.message : error,
    );
  }
}
