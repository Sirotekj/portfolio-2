import { unlink } from 'fs/promises';
import path from 'path';

import {
  IMAGE_WIDTHS,
  isResponsiveImageBase,
} from '@/lib/images/responsive';

function normalizeStoredPath(storedPath: string): string | null {
  const normalized = storedPath.trim().replace(/^\/+/, '').replace(/\\/g, '/');

  if (!normalized.startsWith('uploads/')) {
    return null;
  }

  return normalized.replace(/-(1720|960|372)\.webp$/i, '');
}

/** Smaže responzivní varianty nebo jeden soubor s příponou z public/. */
export async function deleteStoredImage(storedPath: string): Promise<void> {
  const normalized = normalizeStoredPath(storedPath);

  if (!normalized) {
    return;
  }

  const publicDir = path.join(process.cwd(), 'public');

  if (isResponsiveImageBase(normalized)) {
    await Promise.all(
      IMAGE_WIDTHS.map(async (width) => {
        const filePath = path.join(publicDir, `${normalized}-${width}.webp`);

        try {
          await unlink(filePath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }),
    );

    return;
  }

  try {
    await unlink(path.join(publicDir, normalized));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/** Najde cesty k obrázkům z uploads/blog v HTML obsahu článku. */
export function extractUploadPathsFromHtml(html: string): string[] {
  const paths = new Set<string>();
  const pattern = /\/uploads\/blog\/[^\s"'<>]+|uploads\/blog\/[^\s"'<>]+/gi;

  for (const match of html.matchAll(pattern)) {
    const normalized = normalizeStoredPath(match[0]);

    if (normalized?.startsWith('uploads/blog/')) {
      paths.add(normalized);
    }
  }

  return [...paths];
}
