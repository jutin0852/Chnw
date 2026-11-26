import { unstable_cache } from "next/cache";
import { getAllProducts } from "@/lib/store-queries";
import { collapseColourways } from "@/config/colourways";
import { cloudinaryThumb } from "./catalog";
import SiteHeaderClient, { type NavCategory } from "./site-header-client";
import type { SearchItem } from "./search-panel";

const CATEGORY_ORDER = ["bags", "skirts", "dresses", "sets", "tops", "pants"];

// Same data on every page, so cache it instead of querying the database per request.
const getHeaderData = unstable_cache(
  async (): Promise<{ categories: NavCategory[]; searchItems: SearchItem[] }> => {
    const all = await getAllProducts();
    const products = collapseColourways(all);
    const rank = (slug: string) => (CATEGORY_ORDER.includes(slug) ? CATEGORY_ORDER.indexOf(slug) : 99);
    const map = new Map<string, NavCategory>();
    for (const p of products) {
      if (!p.category) continue;
      const found = map.get(p.category.slug);
      if (found) found.count += 1;
      else map.set(p.category.slug, { slug: p.category.slug, name: p.category.name, count: 1, image: p.images[0]?.imageUrl });
    }
    // Every piece (each colour product too), so "brown tote" finds the brown one. Small thumbnails only.
    const searchItems: SearchItem[] = all.map((p) => ({
      slug: p.slug,
      name: p.productName,
      price: p.price,
      image: p.images[0]?.imageUrl ? cloudinaryThumb(p.images[0].imageUrl, 160) : undefined,
      category: p.category?.name,
      colours: p.colours?.length ? p.colours : undefined,
    }));
    return { categories: [...map.values()].sort((a, b) => rank(a.slug) - rank(b.slug)), searchItems };
  },
  ["header-data"],
  { revalidate: 120, tags: ["products"] },
);

export default async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { categories, searchItems } = await getHeaderData().catch(() => ({ categories: [], searchItems: [] }));
  return <SiteHeaderClient overlay={overlay} categories={categories} searchItems={searchItems} />;
}
