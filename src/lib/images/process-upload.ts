import { mkdir } from 'fs/promises';
import path from 'path';

import sharp from 'sharp';

import { IMAGE_WIDTHS } from '@/lib/images/responsive';
import { slugify } from '@/lib/utils/slug';

type SaveResponsiveImagesOptions = {
  file: File;
  folder: string;
};

export type ResponsiveImageUpload = {
  basePath: string;
  width: number;
  height: number;
};

/** Uloží originál jako WebP ve třech šířkách. Vrací cestu a rozměry po EXIF rotaci. */
export async function saveResponsiveImages({
  file,
  folder,
}: SaveResponsiveImagesOptions): Promise<ResponsiveImageUpload> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const originalExtension = path.extname(file.name);
  const baseName =
    slugify(path.basename(file.name, originalExtension)) || 'image';
  const imageId = `${Date.now()}-${baseName}`;
  const uploadDir = path.join(process.cwd(), 'public', folder);

  await mkdir(uploadDir, { recursive: true });

  const outputBasePath = path.join(uploadDir, imageId);
  const { width: imageWidth = 0, height: imageHeight = 0 } = await sharp(buffer)
    .rotate()
    .metadata();

  await Promise.all(
    IMAGE_WIDTHS.map(async (width) => {
      await sharp(buffer)
        .rotate()
        .resize({
          width,
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .toFile(`${outputBasePath}-${width}.webp`);
    }),
  );

  return {
    basePath: `${folder}/${imageId}`.replace(/\\/g, '/'),
    width: imageWidth,
    height: imageHeight,
  };
}
