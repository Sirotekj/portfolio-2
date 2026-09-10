import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
  isResponsiveImageBase,
} from '@/lib/images/responsive';

export function getAboutPhotoSrc(photo: string): string {
  if (!photo) {
    return '';
  }

  if (isResponsiveImageBase(photo)) {
    return getResponsiveImagePath(photo, DEFAULT_IMAGE_WIDTH);
  }

  if (photo.startsWith('/')) {
    return photo;
  }

  return `/${photo}`;
}
