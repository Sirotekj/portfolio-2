import { mkdir } from 'fs/promises';
import path from 'path';

import sharp from 'sharp';

import { IMAGE_WIDTHS } from '@/lib/images/responsive';
import { slugify } from '@/lib/utils/slug';

type SaveResponsiveImagesOptions = {
  file: File;
  folder: string;
};

/** Uloží originál jako WebP ve třech šířkách. Vrací základní cestu bez přípony velikosti. */
export async function saveResponsiveImages({
  file,
  folder,
}: SaveResponsiveImagesOptions): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const originalExtension = path.extname(file.name);
  const baseName =
    slugify(path.basename(file.name, originalExtension)) || 'image';
  const imageId = `${Date.now()}-${baseName}`;
  const uploadDir = path.join(process.cwd(), 'public', folder);

  await mkdir(uploadDir, { recursive: true });

  const outputBasePath = path.join(uploadDir, imageId);

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

  return `${folder}/${imageId}`.replace(/\\/g, '/');
}
