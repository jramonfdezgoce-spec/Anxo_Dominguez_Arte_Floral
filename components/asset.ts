/** Ruta pública con el prefijo de la web (en GitHub Pages vive en una subcarpeta). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
