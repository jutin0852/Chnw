import type { Metadata } from "next";
import { getAllProducts } from "@/lib/store-queries";
import { collapseColourways } from "@/config/colourways";
import SiteHeader from "@/components/store/site-header";
import SiteFooter from "@/components/store/site-footer";
import ShopGrid from "@/components/store/shop-grid";
import { pieceNumbers } from "@/components/store/catalog";
import { getProductFilms } from "@/lib/films-queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const { category } = await searchParams;
  const match = category ? (await getAllProducts()).find((p) => p.category?.slug === category)?.category : undefined;
  if (!match) {
    return {
      title: "Shop all pieces",
      description: "Every CHNW piece: reworked denim skirts, dresses, sets and faux leather totes, made to order in UK sizes 4 to 20.",
      alternates: { canonical: "/shop" },
    };
  }
  return {
    title: `${match.name}`,
    description: `CHNW ${match.name.toLowerCase()}: reworked, small-batch pieces made to order in Nigeria. Delivered across Nigeria.`,
    alternates: { canonical: `/shop?category=${category}` },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category, q }, products, productFilm] = await Promise.all([searchParams, getAllProducts(), getProductFilms()]);
  const numbers = Object.fromEntries(pieceNumbers(products));
  const known = new Set(products.map((p) => p.category?.slug));
  const featured = products.find((p) => p.slug === "the-gigi-pants");
  const feature = featured && productFilm[featured.slug] ? { ...productFilm[featured.slug], product: featured } : undefined;

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-screen bg-paper text-ink outline-none">
        <ShopGrid key={`${category || "all"}|${q || ""}`} initialQuery={(q || "").slice(0, 80)} products={collapseColourways(products)} numbers={numbers} initialCategory={category && known.has(category) ? category : "all"} feature={feature} />
      </main>
      <SiteFooter />
    </>
  );
}
