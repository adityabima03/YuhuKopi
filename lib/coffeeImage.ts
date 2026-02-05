/**
 * Map path gambar dari API ke local asset
 * API mengembalikan "/images/2.png" -> kita pakai require lokal
 */

const IMAGE_MAP: Record<string, number> = {
  "2.png": require("@/assets/images/2.png"),
  "3.png": require("@/assets/images/3.png"),
  "4.png": require("@/assets/images/4.png"),
  "5.png": require("@/assets/images/5.png"),
};

const DEFAULT_IMAGE = require("@/assets/images/2.png");

export function getCoffeeImageSource(imagePath: string): number {
  if (!imagePath) return DEFAULT_IMAGE;
  const filename = imagePath.split("/").pop() || imagePath;
  return IMAGE_MAP[filename] ?? DEFAULT_IMAGE;
}
