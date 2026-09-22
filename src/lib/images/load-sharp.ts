/** Načte sharp bez externalizace v next.config — spolehlivější na Vercelu. */
export async function loadSharp() {
  const module = await import('sharp');
  return module.default;
}
