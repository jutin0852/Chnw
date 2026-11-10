import type { Metadata } from "next";
import { getAllProducts } from "@/lib/store-queries";
import { collapseColourways } from "@/config/colourways";
import SiteHeader from "@/components/store/site-header";
import SiteFooter from "@/components/store/site-footer";
import ShopGrid from "@/components/store/shop-grid";
import { pieceNumbers } from "@/components/store/catalog";
import { productFilm } from "@/config/films";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all pieces",
  description: "Every CHNW piece: reworked denim skirts, dresses, sets and faux leather totes, made to order in UK sizes 4 to 20.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, products] = await Promise.all([searchParams, getAllProducts()]);
  const numbers = Object.fromEntries(pieceNumbers(products));
  const known = new Set(products.map((p) => p.category?.slug));
  const featured = products.find((p) => p.slug === "the-gigi-pants");
  const feature = featured && productFilm[featured.slug] ? { ...productFilm[featured.slug], product: featured } : undefined;

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-screen bg-paper text-ink outline-none">
        <ShopGrid key={category || "all"} products={collapseColourways(products)} numbers={numbers} initialCategory={category && known.has(category) ? category : "all"} feature={feature} />
      </main>
      <SiteFooter />
    </>
  );
}
