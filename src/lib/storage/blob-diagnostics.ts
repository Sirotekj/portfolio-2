import { DEFAULT_IMAGE_WIDTH } from '@/lib/images/responsive';
import {
  blobPublicUrl,
  getBlobStorePrefix,
  isBlobStorageEnabled,
  isRunningOnVercel,
  resolveBlobPublicBaseUrl,
  shouldUseBlobStorage,
} from '@/lib/storage/blob';

export type PortfolioStorageDiagnostics = {
  runtime: 'vercel' | 'local';
  vercelEnv: string | null;
  blobTokenConfigured: boolean;
  blobStoreIdConfigured: boolean;
  blobPublicBaseUrl: string | null;
  blobStorePrefix: string;
  storageMode: 'blob' | 'local-disk' | 'vercel-missing-token';
  blobFileCount: number | null;
  blobListSample: string[];
  blobListError: string | null;
  testImageUrl: string | null;
  notes: string[];
};

async function listPortfolioBlobFiles(
  prefix: string,
): Promise<{ count: number; samplePaths: string[]; error?: string }> {
  if (!isBlobStorageEnabled()) {
    return { count: 0, samplePaths: [], error: 'Token chybí' };
  }

  try {
    const { list } = await import('@vercel/blob');
    const result = await list({
      prefix,
      limit: 100,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      count: result.blobs.length,
      samplePaths: result.blobs.slice(0, 5).map((blob) => blob.pathname),
    };
  } catch (error) {
    return {
      count: 0,
      samplePaths: [],
      error: error instanceof Error ? error.message : 'list() selhalo',
    };
  }
}

export async function getPortfolioStorageDiagnostics(
  sampleDbPath?: string,
): Promise<PortfolioStorageDiagnostics> {
  const notes: string[] = [];
  const onVercel = isRunningOnVercel();
  const tokenConfigured = isBlobStorageEnabled();
  const storeIdConfigured = Boolean(process.env.BLOB_STORE_ID?.trim());
  const publicBaseUrl = resolveBlobPublicBaseUrl();
  const prefix = getBlobStorePrefix();

  let storageMode: PortfolioStorageDiagnostics['storageMode'];

  if (tokenConfigured) {
    storageMode = 'blob';
  } else if (onVercel) {
    storageMode = 'vercel-missing-token';
    notes.push(
      'Na Vercelu bez BLOB_READ_WRITE_TOKEN upload selže — propoj Blob store (Storage → Connections).',
    );
  } else {
    storageMode = 'local-disk';
    notes.push(
      'Lokálně bez tokenu se soubory ukládají do public/uploads/portfolio/, ne do Vercel Blob.',
    );
  }

  if (tokenConfigured && !publicBaseUrl) {
    notes.push(
      'Chybí veřejná URL (BLOB_STORE_ID nebo NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL) — obrázky v DB se nemusí zobrazit.',
    );
  }

  if (
    storeIdConfigured &&
    process.env.BLOB_STORE_ID?.trim().startsWith('store_') &&
    publicBaseUrl &&
    !publicBaseUrl.includes('store_')
  ) {
    notes.push(
      'Veřejná URL používá host bez prefixu store_ (správně pro CDN).',
    );
  }

  if (onVercel && storageMode === 'local-disk') {
    notes.push(
      'Neočekávaný stav: běžíte na Vercelu, ale token chybí — upload by měl skončit chybou.',
    );
  }

  try {
    shouldUseBlobStorage();
  } catch (error) {
    if (error instanceof Error) {
      notes.push(error.message);
    }
  }

  notes.push(
    `V Blob dashboardu hledejte soubory ve složce „${prefix.trim()}/“, ne v kořeni store.`,
  );

  const listPrefix = `${prefix}uploads/portfolio/`;
  let blobFileCount: number | null = null;
  let blobListSample: string[] = [];
  let blobListError: string | null = null;

  if (tokenConfigured) {
    const blobList = await listPortfolioBlobFiles(listPrefix);
    blobFileCount = blobList.count;
    blobListSample = blobList.samplePaths;
    blobListError = blobList.error ?? null;

    if (blobList.error) {
      notes.push(`Blob list: ${blobList.error}`);
    } else if (blobList.count === 0) {
      notes.push(
        'V Blob store zatím nejsou žádné portfolio soubory pod tímto prefixem — upload možná selhal, nebo je store jiný než v DB.',
      );
    }
  }

  const normalizedSamplePath = sampleDbPath?.trim().replace(/^\/+/, '');
  const testImageUrl =
    normalizedSamplePath && publicBaseUrl
      ? blobPublicUrl(`${normalizedSamplePath}-${DEFAULT_IMAGE_WIDTH}.webp`)
      : null;

  return {
    runtime: onVercel ? 'vercel' : 'local',
    vercelEnv: process.env.VERCEL_ENV ?? null,
    blobTokenConfigured: tokenConfigured,
    blobStoreIdConfigured: storeIdConfigured,
    blobPublicBaseUrl: publicBaseUrl,
    blobStorePrefix: prefix,
    storageMode,
    blobFileCount,
    blobListSample,
    blobListError,
    testImageUrl,
    notes,
  };
}
