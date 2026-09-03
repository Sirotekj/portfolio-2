const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function validateImageFile(file: File): string | undefined {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Povolené formáty jsou PNG, JPG nebo WEBP.';
  }

  if (file.size > MAX_SIZE) {
    return 'Soubor je příliš velký. Maximální velikost je 2 MB.';
  }

  return undefined;
}

export { ALLOWED_TYPES, MAX_SIZE };
