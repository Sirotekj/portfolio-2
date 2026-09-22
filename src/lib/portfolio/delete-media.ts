import { deleteStoredImage } from '@/lib/images/delete-upload';
import { IMAGE_WIDTHS, isResponsiveImageBase } from '@/lib/images/responsive';
import {
  blobPublicUrl,
  deleteBlobUrls,
  isBlobStorageEnabled,
  isPortfolioBlobPath,
  isRunningOnVercel,
  resolveBlobPublicBaseUrl,
} from '@/lib/storage/blob';

function portfolioBlobDeleteUrls(storedPath: string): string[] {
  const normalized = storedPath.trim().replace(/^\/+/, '');

  if (isResponsiveImageBase(normalized)) {
    return IMAGE_WIDTHS.map((width) =>
      blobPublicUrl(`${normalized}-${width}.webp`),
    );
  }

  return [blobPublicUrl(normalized)];
}

export async function deletePortfolioMedia(storedPath: string): Promise<void> {
  const normalized = storedPath.trim();

  if (!normalized) {
    return;
  }

  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://')
  ) {
    await deleteBlobUrls([normalized]);
    return;
  }

  if (isPortfolioBlobPath(normalized)) {
    if (resolveBlobPublicBaseUrl()) {
      await deleteBlobUrls(portfolioBlobDeleteUrls(normalized));
    }

    return;
  }

  if (isBlobStorageEnabled() && isRunningOnVercel()) {
    return;
  }

  await deleteStoredImage(normalized);
}
