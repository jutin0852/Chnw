import { BRAND } from "@/config/brand";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL;
  const wwwOrigin = new RegExp(`^https://www\\.${BRAND.domain.replace(/\./g, "\\.")}$`, "i");
  if (configuredUrl) return configuredUrl.replace(/\/$/, "").replace(wwwOrigin, `https://${BRAND.domain}`);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
