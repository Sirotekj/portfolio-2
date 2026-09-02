export const IMAGE_WIDTHS = [1720, 960, 372] as const;

export type ImageWidth = (typeof IMAGE_WIDTHS)[number];

export const DEFAULT_IMAGE_WIDTH: ImageWidth = 960;

/** V DB je uložená základní cesta bez přípony velikosti, např. uploads/blog/123-foto */
export function isResponsiveImageBase(path: string): boolean {
  return !/\.(png|jpe?g|webp|gif|avif)$/i.test(path);
}

export function getResponsiveImagePath(
  basePath: string,
  width: ImageWidth = DEFAULT_IMAGE_WIDTH,
): string {
  if (!basePath) {
    return '';
  }

  const normalized = basePath.replace(/^\/+/, '');

  if (!isResponsiveImageBase(normalized)) {
    return `/${normalized}`;
  }

  return `/${normalized}-${width}.webp`;
}

export function getResponsiveImageSrcSet(basePath: string): string {
  if (!basePath || !isResponsiveImageBase(basePath.replace(/^\/+/, ''))) {
    return '';
  }

  return IMAGE_WIDTHS.map(
    (width) => `${getResponsiveImagePath(basePath, width)} ${width}w`,
  ).join(', ');
}
