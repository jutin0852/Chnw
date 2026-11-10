import { asc, eq } from "drizzle-orm";
import { FilmsManager } from "../../../components/admin/films-manager";
import { requireAdmin } from "../../../lib/admin-auth";
import { db } from "../../../lib/db";
import { products, siteFilms } from "../../../lib/schema";

export const dynamic = "force-dynamic";

export default async function FilmsPage() {
  await requireAdmin();
  const [rows, productRows] = await Promise.all([
    db.select().from(siteFilms).orderBy(asc(siteFilms.position)),
    db.select({ id: products.id, name: products.productName, isActive: products.isActive }).from(products).where(eq(products.isActive, true)).orderBy(asc(products.productName)),
  ]);
  const hero = [0, 1, 2].map((position) => {
    const row = rows.find((r) => r.placement === "hero" && r.position === position);
    return { position, videoId: row?.videoId ?? null, alt: row?.alt ?? "" };
  });
  const productFilms = productRows.map((p) => {
    const row = rows.find((r) => r.placement === "product" && r.productId === p.id);
    return { id: p.id, name: p.name, videoId: row?.videoId ?? null, alt: row?.alt ?? "" };
  });
  return (
    <section className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div>
        <h1 className="text-xl font-semibold">Films</h1>
        <p className="text-sm text-muted-foreground">Choose the videos shown on the home page and on each product page. Upload a short vertical clip (MP4 or MOV, up to 100 MB). Films are shrunk automatically when you upload them (720 pixels wide, no sound), so they load fast and use little storage. They appear on the store within a minute.</p>
      </div>
      <FilmsManager hero={hero} productFilms={productFilms} />
    </section>
  );
}
