"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteFilms } from "@/lib/schema";
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

export async function setProductFilm(productId: string, videoId: string, alt: string) {
  await requireAdmin();
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
