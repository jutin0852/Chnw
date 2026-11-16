import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { isIndexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never compete with the live store in Google.
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/", "/checkout/", "/api/", "/login"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
