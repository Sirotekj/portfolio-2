import type { ResponsiveImageUpload } from '@/lib/images/process-upload';

export type { ResponsiveImageUpload } from '@/lib/images/process-upload';

type SaveResponsiveImagesOptions = {
  file: File;
  folder: string;
};

/** Lazy-loads sharp only when an upload actually runs (not on public page reads). */
export async function saveResponsiveImages(
  options: SaveResponsiveImagesOptions,
): Promise<ResponsiveImageUpload> {
  const { saveResponsiveImages: save } = await import(
    '@/lib/images/process-upload'
  );
  return save(options);
}
