import { unstable_cache } from "next/cache";
import { getAllProducts } from "@/lib/store-queries";
import { collapseColourways } from "@/config/colourways";
import SiteHeaderClient, { type NavCategory } from "./site-header-client";

const CATEGORY_ORDER = ["bags", "skirts", "dresses", "sets", "tops", "pants"];

// Same list on every page, so cache it instead of querying the database per request.
const getNavCategories = unstable_cache(
  async (): Promise<NavCategory[]> => {
    const products = collapseColourways(await getAllProducts());
    const rank = (slug: string) => (CATEGORY_ORDER.includes(slug) ? CATEGORY_ORDER.indexOf(slug) : 99);
    const map = new Map<string, NavCategory>();
    for (const p of products) {
      if (!p.category) continue;
      const found = map.get(p.category.slug);
      if (found) found.count += 1;
      else map.set(p.category.slug, { slug: p.category.slug, name: p.category.name, count: 1, image: p.images[0]?.imageUrl });
    }
    return [...map.values()].sort((a, b) => rank(a.slug) - rank(b.slug));
  },
  ["nav-categories"],
  { revalidate: 120, tags: ["products"] },
);

export default async function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const categories = await getNavCategories().catch(() => []);
  return <SiteHeaderClient overlay={overlay} categories={categories} />;
}
