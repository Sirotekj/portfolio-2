import {
  uploadPortfolioImageAction,
  uploadPortfolioVideoAction,
  type PortfolioImageUploadResult,
  type PortfolioVideoUploadResult,
} from '@/lib/actions/portfolio-actions';

const FILE_FIELD_NAMES = new Set(['image', 'gallery', 'video']);

function isFileEntry(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function copyNonFileFields(source: FormData, target: FormData): void {
  for (const [key, value] of source.entries()) {
    if (FILE_FIELD_NAMES.has(key)) {
      continue;
    }

    if (value instanceof File) {
      continue;
    }

    target.append(key, value);
  }
}

function isImageUploadError(
  result: PortfolioImageUploadResult,
): result is { error: string } {
  return 'error' in result && typeof result.error === 'string';
}

function isVideoUploadError(
  result: PortfolioVideoUploadResult,
): result is { error: string } {
  return 'error' in result && typeof result.error === 'string';
}

async function uploadSingleImage(file: File): Promise<PortfolioImageUploadResult> {
  const payload = new FormData();
  payload.set('file', file);
  return uploadPortfolioImageAction(payload);
}

export async function buildPortfolioSubmitFormData(
  source: FormData,
): Promise<{ formData?: FormData; error?: string }> {
  const target = new FormData();
  copyNonFileFields(source, target);

  const mainImageFile = source.get('image');

  if (isFileEntry(mainImageFile)) {
    const upload = await uploadSingleImage(mainImageFile);

    if (isImageUploadError(upload)) {
      return { error: upload.error };
    }

    target.set('preUploadedImage', upload.basePath);
    target.set('preUploadedImageWidth', String(upload.width));
    target.set('preUploadedImageHeight', String(upload.height));
  }

  for (const entry of source.getAll('gallery')) {
    if (!isFileEntry(entry)) {
      continue;
    }

    const upload = await uploadSingleImage(entry);

    if (isImageUploadError(upload)) {
      return { error: upload.error };
    }

    target.append('existingGallery', upload.basePath);
  }

  const videoFile = source.get('video');

  if (isFileEntry(videoFile)) {
    const payload = new FormData();
    payload.set('file', videoFile);
    const upload = await uploadPortfolioVideoAction(payload);

    if (isVideoUploadError(upload)) {
      return { error: upload.error };
    }

    target.set('preUploadedVideo', upload.path);
    const videoWidth = source.get('videoWidth');
    const videoHeight = source.get('videoHeight');

    if (typeof videoWidth === 'string' && videoWidth.trim()) {
      target.set('preUploadedVideoWidth', videoWidth.trim());
    }

    if (typeof videoHeight === 'string' && videoHeight.trim()) {
      target.set('preUploadedVideoHeight', videoHeight.trim());
    }
  }

  return { formData: target };
}
