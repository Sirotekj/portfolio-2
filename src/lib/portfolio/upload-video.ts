import path from 'path';

import {
  putBlob,
  isBlobStorageEnabled,
  withBlobStorePrefix,
} from '@/lib/storage/blob';
import { slugify } from '@/lib/utils/slug';
import type { VideoUpload } from '@/lib/videos/save-video';
import { saveProjectVideo as saveProjectVideoLocal } from '@/lib/videos/save-video';
import { validateVideoFile } from '@/lib/videos/validate-video-file';

const PORTFOLIO_VIDEO_FOLDER = 'uploads/portfolio/videos';

async function savePortfolioVideoToBlob(file: File): Promise<VideoUpload> {
  const validationError = validateVideoFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const originalExtension = path.extname(file.name).toLowerCase() || '.mp4';
  const baseName = slugify(path.basename(file.name, originalExtension)) || 'video';
  const videoId = `${Date.now()}-${baseName}`;
  const storedPath = `${PORTFOLIO_VIDEO_FOLDER}/${videoId}${originalExtension}`.replace(
    /\\/g,
    '/',
  );
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    originalExtension === '.webm' ? 'video/webm' : 'video/mp4';

  await putBlob(storedPath, buffer, contentType);

  return { path: withBlobStorePrefix(storedPath) };
}

export async function savePortfolioVideo(file: File): Promise<VideoUpload> {
  if (isBlobStorageEnabled()) {
    return savePortfolioVideoToBlob(file);
  }

  return saveProjectVideoLocal(file);
}
