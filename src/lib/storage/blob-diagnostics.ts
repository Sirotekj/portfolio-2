import {
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
  sampleImageUrl: string | null;
  notes: string[];
};

export function getPortfolioStorageDiagnostics(): PortfolioStorageDiagnostics {
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

  const samplePath = `${prefix}uploads/portfolio/example-960.webp`;
  const sampleImageUrl = publicBaseUrl
    ? `${publicBaseUrl}/${samplePath}`
    : null;

  return {
    runtime: onVercel ? 'vercel' : 'local',
    vercelEnv: process.env.VERCEL_ENV ?? null,
    blobTokenConfigured: tokenConfigured,
    blobStoreIdConfigured: storeIdConfigured,
    blobPublicBaseUrl: publicBaseUrl,
    blobStorePrefix: prefix,
    storageMode,
    sampleImageUrl,
    notes,
  };
}
