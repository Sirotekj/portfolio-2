import {
  DEFAULT_IMAGE_WIDTH,
  getResponsiveImagePath,
  getResponsiveImageSrcSet,
} from '@/lib/images/responsive';

type ResponsiveImageProps = {
  basePath: string;
  alt: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
};

export default function ResponsiveImage({
  basePath,
  alt,
  className,
  sizes,
  fill = false,
}: ResponsiveImageProps) {
  const src = getResponsiveImagePath(basePath, DEFAULT_IMAGE_WIDTH);
  const srcSet = getResponsiveImageSrcSet(basePath);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- vlastní srcSet variant z public/
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt}
      className={
        fill
          ? `absolute inset-0 h-full w-full object-cover ${className ?? ''}`
          : className
      }
    />
  );
}
