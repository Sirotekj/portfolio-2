import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
  isResponsiveImageBase,
} from '@/lib/images/responsive';
import type { ProjectView } from '@/types/types';

export function getProjectImageSrc(project: ProjectView): string {
  if (!project.image) {
    return '';
  }

  if (isResponsiveImageBase(project.image)) {
    return getResponsiveImagePath(project.image, DEFAULT_IMAGE_WIDTH);
  }

  return `/${project.image}.jpg`;
}

export function hasProjectImageDimensions(
  project: ProjectView,
): project is ProjectView & { imageWidth: number; imageHeight: number } {
  return project.imageWidth != null && project.imageHeight != null;
}
