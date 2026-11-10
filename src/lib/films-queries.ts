import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, siteFilms } from "@/lib/schema";
import { heroFilms as defaultHero, productFilm as defaultProduct, type Film } from "@/config/films";

// Films managed in /admin/films. Falls back to the built-in films when the table is missing or
// empty, so the storefront never shows a hole. Cached briefly; saving in the admin revalidates it.
const load = unstable_cache(
  async () => {
    try {
      const rows = await db
        .select({ placement: siteFilms.placement, position: siteFilms.position, videoId: siteFilms.videoId, alt: siteFilms.alt, slug: products.slug, name: products.productName })
        .from(siteFilms)
        .leftJoin(products, eq(products.id, siteFilms.productId))
        .orderBy(asc(siteFilms.position));
      return rows;
    } catch {
      return [];
    }
  },
  ["site-films"],
  { revalidate: 60, tags: ["films"] },
);

export async function getHeroFilms(): Promise<Film[]> {
  const rows = (await load()).filter((r) => r.placement === "hero");
  if (!rows.length) return defaultHero;
  // Always three slots, in order; an empty slot falls back to the built-in film for that position.
  return [0, 1, 2].map((i) => {
    const row = rows.find((r) => r.position === i);
    return row ? { code: row.videoId, alt: row.alt || "A CHNW film" } : defaultHero[i];
  });
}

export async function getProductFilms(): Promise<Record<string, Film>> {
  const rows = (await load()).filter((r) => r.placement === "product" && r.slug);
  if (!rows.length) return defaultProduct;
  return Object.fromEntries(rows.map((r) => [r.slug as string, { code: r.videoId, alt: r.alt || `${r.name} in motion` }]));
}
