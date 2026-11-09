import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";

// Lets "Add to Home Screen" open the store full-screen, like an installed app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: `${BRAND.name} store and admin.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/brand/favicon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
