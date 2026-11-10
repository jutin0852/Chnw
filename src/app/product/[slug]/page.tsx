import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetail from "../../../components/store/product-detail";
import ProductCard from "../../../components/store/product-card";
import { collapseColourways, optionGroupFor } from "@/config/colourways";
import SiteHeader from "../../../components/store/site-header";
import SiteFooter from "../../../components/store/site-footer";
import { pieceNumbers } from "../../../components/store/catalog";
import { getAllProducts, getProductBySlug } from "../../../lib/store-queries";
import { productFilm } from "@/config/films";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product unavailable", robots: { index: false, follow: false } };
  const description = (product.description || `${product.productName} from CHNW.`).slice(0, 160);
  const image = product.images[0]?.imageUrl;
  const imageUrl = image ? new URL(image, getSiteUrl()).toString() : undefined;
  return {
    title: product.productName,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.productName} | CHNW`,
      description,
      url: `/product/${product.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.images[0]?.altText || product.productName }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.productName} | CHNW`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getAllProducts()]);

  if (!product) {
    notFound();
  }

  const numbers = pieceNumbers(all);
  // "Wear it with": pieces from other families first, so the suggestions make an outfit.
  const siblings = new Set(optionGroupFor(slug)?.items.map((i) => i.slug));
  const others = collapseColourways(all.filter((p) => p.id !== product.id && !siblings.has(p.slug)));
  const related = [...others.filter((p) => p.category?.slug !== product.category?.slug), ...others.filter((p) => p.category?.slug === product.category?.slug)].slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-screen bg-paper pb-24 text-ink outline-none lg:pb-0">
        <Suspense fallback={<div className="min-h-screen" />}>
          <ProductDetail product={product} number={numbers.get(product.id)} film={productFilm[product.slug]} />
        </Suspense>
        {related.length > 0 && (
          <section aria-labelledby="with-title" className="bg-mist">
            <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
              <h2 id="with-title" data-split="lines" className="mb-8 font-display text-[38px] leading-none sm:text-[52px]">Wear it with</h2>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {related.map((p, i) => (
                  <li key={p.id} data-reveal="up" data-delay={String(i * 0.06)}>
                    <ProductCard product={p} number={numbers.get(p.id)} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
