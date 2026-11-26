// The colours a product can be offered in. Ticked per product when adding or editing it; the
// customer then picks one on the product page and it is saved with their order.
export const PRODUCT_COLOURS = [
  { name: "Black", swatch: "#141210" },
  { name: "Red", swatch: "#a40009" },
  { name: "Purple", swatch: "#5b2a6e" },
  { name: "Olive green", swatch: "#5f6b2f" },
  { name: "Brown", swatch: "#6b4428" },
] as const;

export const swatchFor = (name: string) => PRODUCT_COLOURS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.swatch;

/** Clean a submitted colour list: trimmed, de-duplicated, at most 12, each at most 40 characters. */
export function cleanColours(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input) {
    if (typeof raw !== "string") continue;
    const name = raw.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    out.push(name);
    if (out.length >= 12) break;
  }
  return out;
}
