import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { slugify } from '@/lib/utils/slug';

import { validateVideoFile } from './validate-video-file';

export type VideoUpload = {
  path: string;
};

export async function saveProjectVideo(file: File): Promise<VideoUpload> {
  const validationError = validateVideoFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const folder = 'uploads/portfolio/videos';
  const originalExtension = path.extname(file.name).toLowerCase() || '.mp4';
  const baseName = slugify(path.basename(file.name, originalExtension)) || 'video';
  const videoId = `${Date.now()}-${baseName}`;
  const uploadDir = path.join(process.cwd(), 'public', folder);

  await mkdir(uploadDir, { recursive: true });

  const storedPath = `${folder}/${videoId}${originalExtension}`.replace(/\\/g, '/');
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(process.cwd(), 'public', storedPath), buffer);

  return { path: storedPath };
}
