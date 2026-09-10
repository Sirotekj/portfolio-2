import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
  isResponsiveImageBase,
} from '@/lib/images/responsive';

export const ABOUT_PHOTO_PLACEHOLDER = '/about-placeholder.svg';

export function getAboutPhotoSrc(photo: string): string {
  if (!photo) {
    return ABOUT_PHOTO_PLACEHOLDER;
  }

  if (isResponsiveImageBase(photo)) {
    return getResponsiveImagePath(photo, DEFAULT_IMAGE_WIDTH);
  }

  if (photo.startsWith('/')) {
    return photo;
  }

  return `/${photo}`;
}
