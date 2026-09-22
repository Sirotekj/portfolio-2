import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
} from '@/lib/images/responsive';
import { blobPublicUrl, isBlobStoredPath } from '@/lib/storage/blob';
import type { ProjectView } from '@/types/types';

export type ProjectMediaKind = 'image' | 'gallery' | 'video';

export function getProjectMediaKind(project: ProjectView): ProjectMediaKind {
  if (project.video.trim()) {
    return 'video';
  }

  if (project.gallery.length > 0) {
    return 'gallery';
  }

  return 'image';
}

export function getProjectGalleryImages(project: ProjectView): string[] {
  if (getProjectMediaKind(project) !== 'gallery') {
    return [];
  }

  return [project.image, ...project.gallery].filter(Boolean);
}

export function getStoredMediaPath(path: string): string {
  const normalized = path.trim().replace(/^\/+/, '');

  if (!normalized) {
    return '';
  }

  if (isBlobStoredPath(normalized)) {
    return blobPublicUrl(normalized);
  }

  return `/${normalized}`;
}

export function getProjectVideoSrc(project: ProjectView): string {
  return getStoredMediaPath(project.video);
}

export function getProjectImagePath(
  imagePath: string,
  width = DEFAULT_IMAGE_WIDTH,
): string {
  if (!imagePath.trim()) {
    return '';
  }

  return getResponsiveImagePath(imagePath, width);
}
