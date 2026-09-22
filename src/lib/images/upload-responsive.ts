import path from 'path';

import type { ResponsiveImageUpload } from '@/lib/images/process-upload';
import { saveResponsiveImages } from '@/lib/images/save-upload';
import { IMAGE_WIDTHS } from '@/lib/images/responsive';
import { loadSharp } from '@/lib/images/load-sharp';
import {
  isBlobStorageEnabled,
  putBlob,
  shouldUseBlobStorage,
  withBlobStorePrefix,
} from '@/lib/storage/blob';
import { slugify } from '@/lib/utils/slug';

function getStoredBasePath(folder: string, imageId: string): string {
  const relativePath = `${folder}/${imageId}`.replace(/\\/g, '/');

  if (isBlobStorageEnabled()) {
    return withBlobStorePrefix(relativePath);
  }

  return relativePath;
}

async function saveResponsiveImageToBlob(
  file: File,
  folder: string,
): Promise<ResponsiveImageUpload> {
  const sharp = await loadSharp();
  const buffer = Buffer.from(await file.arrayBuffer());
  const originalExtension = path.extname(file.name);
  const baseName =
    slugify(path.basename(file.name, originalExtension)) || 'image';
  const imageId = `${Date.now()}-${baseName}`;
  const relativeBase = `${folder}/${imageId}`.replace(/\\/g, '/');
  const basePath = getStoredBasePath(folder, imageId);

  const { width: imageWidth = 0, height: imageHeight = 0 } = await sharp(buffer)
    .rotate()
    .metadata();

  const uploads = await Promise.all(
    IMAGE_WIDTHS.map(async (width) => {
      const output = await sharp(buffer)
        .rotate()
        .resize({
          width,
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toBuffer();

      const result = await putBlob(
        `${relativeBase}-${width}.webp`,
        output,
        'image/webp',
      );

      return { width, result };
    }),
  );

  const defaultUpload = uploads.find((entry) => entry.width === 960);
  const storedBasePath =
    defaultUpload?.result.pathname.replace(/-960\.webp$/i, '') ?? basePath;

  return {
    basePath: storedBasePath,
    width: imageWidth,
    height: imageHeight,
  };
}

export async function saveResponsiveImage(
  file: File,
  folder: string,
): Promise<ResponsiveImageUpload> {
  const normalizedFolder = folder.replace(/^\/+/, '').replace(/\/+$/, '');

  if (shouldUseBlobStorage()) {
    return saveResponsiveImageToBlob(file, normalizedFolder);
  }

  return saveResponsiveImages({
    file,
    folder: normalizedFolder,
  });
}
