import { unstable_cache } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, siteFilms } from "@/lib/schema";
import { featuredFilms, heroFilms as defaultHero, reelFilms, REEL_SLOTS, type Film, type ReelFilm } from "@/config/films";

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

/**
 * Films for the featured products only (Crochet Denim Skirt, Gigi Pants), keyed by product slug.
 * Each falls back to its built-in film on its own, so uploading one never hides the other.
 */
export async function getProductFilms(): Promise<Record<string, Film>> {
  const rows = (await load()).filter((r) => r.placement === "product" && r.slug);
  return Object.fromEntries(
    featuredFilms.map(({ slug, film }) => {
      const row = rows.find((r) => r.slug === slug);
      return [slug, row ? { code: row.videoId, alt: row.alt || film.alt } : film];
    }),
  );
}

/** The four "Captured moments" reels, in order. An empty slot falls back to its built-in film. */
export async function getReelFilms(): Promise<ReelFilm[]> {
  const rows = (await load()).filter((r) => r.placement === "reel" && r.slug);
  return Array.from({ length: REEL_SLOTS }, (_, i) => {
    const row = rows.find((r) => r.position === i);
    if (!row) return reelFilms[i];
    return { code: row.videoId, alt: row.alt || `${row.name} being worn`, slug: row.slug as string, label: row.name || "" };
  });
}
