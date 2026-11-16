import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/store-queries";
import { getSiteUrl } from "@/lib/site-url";

// Rebuilt at most once an hour, so crawlers never add database load.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  // Cached storefront query: the same data the shop already serves.
  const products = await getAllProducts();
  const categories = [...new Map(products.filter((p) => p.category?.slug).map((p) => [p.category!.slug!, p])).keys()];
  const latest = products.reduce<Date>((max, p) => {
    const updated = p.updatedAt ? new Date(p.updatedAt) : null;
    return updated && updated > max ? updated : max;
  }, new Date(0));
  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((slug) => ({ url: `${siteUrl}/shop?category=${slug}`, lastModified: latest, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${siteUrl}/shipping-delivery`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/returns-exchanges`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...pages,
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt || product.createdAt || undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: product.images.slice(0, 5).map((image) => image.imageUrl),
    })),
  ];
}
