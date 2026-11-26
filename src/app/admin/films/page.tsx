import { asc, inArray } from "drizzle-orm";
import { FilmsManager } from "../../../components/admin/films-manager";
import { requireAdmin } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { products, siteFilms } from "../../../lib/schema";
import { featuredFilms, FEATURED_FILM_SLUGS, heroFilms } from "@/config/films";

export const dynamic = "force-dynamic";

export default async function FilmsPage() {
  await requireAdmin();
  const [rows, productRows] = await Promise.all([
    db.select().from(siteFilms).orderBy(asc(siteFilms.position)),
    db.select({ id: products.id, slug: products.slug }).from(products).where(inArray(products.slug, FEATURED_FILM_SLUGS)),
  ]);
  const hero = [0, 1, 2].map((position) => {
    const row = rows.find((r) => r.placement === "hero" && r.position === position);
    return { position, videoId: row?.videoId ?? heroFilms[position].code, alt: row?.alt ?? heroFilms[position].alt, uploaded: Boolean(row) };
  });
  // Only the featured films are managed here. A slot with no upload shows its built-in film.
  const productFilms = featuredFilms.flatMap(({ slug, label, where, film }) => {
    const product = productRows.find((p) => p.slug === slug);
    if (!product) return [];
    const row = rows.find((r) => r.placement === "product" && r.productId === product.id);
    return [{ id: product.id, name: label, where, videoId: row?.videoId ?? film.code, alt: row?.alt ?? film.alt, uploaded: Boolean(row) }];
  });
  return (
    <section className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div>
        <h1 className="text-xl font-semibold">Films</h1>
        <p className="text-sm text-muted-foreground">Choose the films shown in the home page hero, the crochet skirt section on the home page, and the featured film on the shop page. Upload a short vertical clip (MP4 or MOV, up to 100 MB). Films are shrunk automatically when you upload them (720 pixels wide, no sound), so they load fast and use little storage. They appear on the store within a minute.</p>
      </div>
      <FilmsManager hero={hero} productFilms={productFilms} />
    </section>
  );
}
