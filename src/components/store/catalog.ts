import type { StoreProduct } from "./cart-context";

type Dated = { id: string; createdAt?: Date | string | null };

/**
 * Piece numbers ("No. 001") follow the order pieces were added to the store, oldest first,
 * so a piece keeps its number as new ones arrive.
 */
export function pieceNumbers(products: Dated[]) {
  const sorted = [...products].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  return new Map(sorted.map((p, i) => [p.id, `No. ${String(i + 1).padStart(3, "0")}`]));
}

/** A small Cloudinary rendition of a product photo (for the loader and thumbnails). */
export function cloudinaryThumb(url: string, width: number) {
  return url.includes("res.cloudinary.com") ? url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`) : url;
}

/** Drop "The " for compact labels: "The Triangle Tote" → "Triangle Tote". */
export const shortName = (name: string) => name.replace(/^The\s+/i, "");

/** Sizes are stored as "UK 10" (or "10"); this returns just "10". */
export const sizeValue = (size: string) => size.replace(/^UK\s*/i, "").trim();

/** "UK 10" for a stored size, "One size" for none. */
export function sizeLabel(size?: string | null) {
  if (!size || size === "ONE_SIZE") return "One size";
  return `UK ${sizeValue(size)}`;
}

/** "UK 4 to 20" from the size list, or "One size". */
export function sizeSummary(product: Pick<StoreProduct, "sizes">) {
  const sizes = (product.sizes || []).filter((s) => s && s !== "ONE_SIZE").map(sizeValue);
  if (sizes.length === 0) return "One size";
  const numeric = sizes.map(Number).filter((n) => !Number.isNaN(n));
  if (numeric.length === sizes.length) return `UK ${Math.min(...numeric)} to ${Math.max(...numeric)}`;
  return sizes.join(", ");
}

/** CHNW's UK size chart, from the Size chart highlight on Instagram (inches). */
export const UK_SIZE_CHART: [size: string, bust: number, waist: number, hips: number][] = [
  ["4", 32, 25, 34],
  ["6", 33, 27, 36],
  ["8", 35, 29, 38],
  ["10", 37, 30, 40],
  ["12", 38, 32, 41],
  ["14", 40, 33, 43],
  ["16", 41, 35, 44],
  ["18", 44, 37, 47],
  ["20", 46, 40, 49],
];
