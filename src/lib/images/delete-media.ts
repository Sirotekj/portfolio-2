import { deleteStoredImage } from '@/lib/images/delete-upload';
import { IMAGE_WIDTHS, isResponsiveImageBase } from '@/lib/images/responsive';
import {
  blobPublicUrl,
  deleteBlobUrls,
  isBlobStorageEnabled,
  isBlobStoredPath,
  isRunningOnVercel,
  resolveBlobPublicBaseUrl,
} from '@/lib/storage/blob';

function blobDeleteUrls(storedPath: string): string[] {
  const normalized = storedPath.trim().replace(/^\/+/, '');

  if (isResponsiveImageBase(normalized)) {
    return IMAGE_WIDTHS.map((width) =>
      blobPublicUrl(`${normalized}-${width}.webp`),
    );
  }

  return [blobPublicUrl(normalized)];
}

export async function deleteStoredMedia(storedPath: string): Promise<void> {
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

  if (isBlobStoredPath(normalized)) {
    if (resolveBlobPublicBaseUrl()) {
      await deleteBlobUrls(blobDeleteUrls(normalized));
    }

    return;
  }

  if (isBlobStorageEnabled() && isRunningOnVercel()) {
    return;
  }

  await deleteStoredImage(normalized);
}
