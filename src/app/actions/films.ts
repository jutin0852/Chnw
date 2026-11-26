"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, siteFilms } from "@/lib/schema";
import { FEATURED_FILM_SLUGS, reelFilms, REEL_SLOTS } from "@/config/films";
import { requireAdmin } from "@/lib/admin-auth";

// Only Cloudinary public ids from our own folders are accepted.
const VIDEO_ID = /^chnw\/[A-Za-z0-9_\-/]{3,160}$/;

function refresh() {
  revalidateTag("films", "max");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/films");
  revalidatePath("/product/[slug]", "page");
}

export async function setHeroFilm(position: number, videoId: string, alt: string) {
  await requireAdmin();
  if (![0, 1, 2].includes(position)) throw new Error("Pick one of the three hero slots.");
  if (!VIDEO_ID.test(videoId)) throw new Error("That video could not be used.");
  const altText = alt.trim().slice(0, 200) || null;
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "hero"), eq(siteFilms.position, position)));
  await db.insert(siteFilms).values({ placement: "hero", position, videoId, alt: altText });
  refresh();
}

export async function removeHeroFilm(position: number) {
  await requireAdmin();
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "hero"), eq(siteFilms.position, position)));
  refresh();
}

/** Product films are only kept for the featured products (Crochet Denim Skirt, Gigi Pants). */
async function requireFeaturedProduct(productId: string) {
  const [row] = await db.select({ slug: products.slug }).from(products).where(eq(products.id, productId)).limit(1);
  if (!row || !FEATURED_FILM_SLUGS.includes(row.slug)) throw new Error("Films can only be set for the featured products.");
}

export async function setProductFilm(productId: string, videoId: string, alt: string) {
  await requireAdmin();
  await requireFeaturedProduct(productId);
  if (!VIDEO_ID.test(videoId)) throw new Error("That video could not be used.");
  const altText = alt.trim().slice(0, 200) || null;
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "product"), eq(siteFilms.productId, productId)));
  await db.insert(siteFilms).values({ placement: "product", productId, position: 0, videoId, alt: altText });
  refresh();
}

export async function removeProductFilm(productId: string) {
  await requireAdmin();
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "product"), eq(siteFilms.productId, productId)));
  refresh();
}

/**
 * A "Captured moments" reel: a film plus the product it links to. The video is either a
 * fresh upload or the slot's built-in film (when only the product or description changes).
 */
export async function setReelFilm(position: number, videoId: string, alt: string, productId: string) {
  await requireAdmin();
  if (!Number.isInteger(position) || position < 0 || position >= REEL_SLOTS) throw new Error("Pick one of the reel slots.");
  if (!VIDEO_ID.test(videoId) && videoId !== reelFilms[position]?.code) throw new Error("That video could not be used.");
  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
  if (!product) throw new Error("Choose the piece this film shows.");
  const altText = alt.trim().slice(0, 200) || null;
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "reel"), eq(siteFilms.position, position)));
  await db.insert(siteFilms).values({ placement: "reel", position, productId, videoId, alt: altText });
  refresh();
}

export async function removeReelFilm(position: number) {
  await requireAdmin();
  await db.delete(siteFilms).where(and(eq(siteFilms.placement, "reel"), eq(siteFilms.position, position)));
  refresh();
}
