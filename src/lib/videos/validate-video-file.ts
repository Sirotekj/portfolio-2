const MAX_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = ['video/mp4', 'video/webm'];

export function validateVideoFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Povolené formáty jsou MP4 nebo WebM.';
  }

  if (file.size > MAX_SIZE) {
    return 'Soubor je příliš velký. Maximální velikost je 15 MB.';
  }

  return undefined;
}

export { ALLOWED_TYPES, MAX_SIZE };
