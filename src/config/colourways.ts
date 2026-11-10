// Pieces that come in more than one colour (or size/length) are separate products, so each has its
// own photos and stock. This links them so the product page can show "Colour: Black / Brown / Cherry red".
export type OptionGroup = { label: string; items: { slug: string; name: string }[] };

export const optionGroups: OptionGroup[] = [
  { label: "Colour", items: [{ slug: "the-triangle-tote", name: "Black" }, { slug: "the-triangle-tote-brown", name: "Brown" }, { slug: "the-triangle-tote-cherry-red", name: "Cherry red" }] },
  { label: "Colour", items: [{ slug: "the-crochet-denim-skirt", name: "Black" }, { slug: "the-crochet-denim-skirt-blue", name: "Blue" }] },
  { label: "Colour", items: [{ slug: "the-halter-tank", name: "Black" }, { slug: "the-halter-tank-burgundy", name: "Burgundy" }] },
  { label: "Colour", items: [{ slug: "the-soni-dress", name: "Black" }, { slug: "the-soni-dress-tan", name: "Tan" }] },
  { label: "Colour", items: [{ slug: "the-clilla-set", name: "Blue" }, { slug: "the-clilla-set-black", name: "Black" }] },
  { label: "Print", items: [{ slug: "the-gigi-pants", name: "Black and red" }, { slug: "the-gigi-pants-polka-dot", name: "Polka dot" }] },
  { label: "Size", items: [{ slug: "the-denim-triangle-tote-grande", name: "Grande" }, { slug: "the-denim-triangle-tote-jumbo", name: "Jumbo" }] },
  { label: "Size", items: [{ slug: "the-upcycled-denim-crochet-bag-mini", name: "Mini" }, { slug: "the-upcycled-denim-crochet-bag-midi", name: "Midi" }] },
  { label: "Length", items: [{ slug: "the-button-up-dress-mini", name: "Mini" }, { slug: "the-button-up-dress-midi", name: "Midi" }] },
];

export const optionGroupFor = (slug: string) => optionGroups.find((g) => g.items.some((i) => i.slug === slug));

/** One piece in several colours, sizes or lengths: the shop lists the first and the product page offers the rest. */
export function collapseColourways<T extends { slug: string }>(products: T[]): T[] {
  const hidden = new Set(
    optionGroups.filter((g) => g.label !== "Print").flatMap((g) => g.items.slice(1).map((i) => i.slug)),
  );
  return products.filter((p) => !hidden.has(p.slug));
}

/** "The Triangle Tote, Black" shows as "The Triangle Tote" on cards, with the colour count beside it. */
export function colourCard(name: string, slug: string) {
  const g = optionGroupFor(slug);
  if (!g || g.label === "Print") return { name, options: "", ownSize: false };
  const base = name.replace(/,\s*[^,]+$/, "");
  if (g.label === "Colour") return { name: base, options: `${g.items.length} colours`, ownSize: false };
  return { name: base, options: g.items.map((i) => i.name).join(" or "), ownSize: g.label === "Size" };
}
