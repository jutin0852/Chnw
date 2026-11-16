import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/config/brand";

const canonicalHost = BRAND.domain;

// The address the store is published under (NEXT_PUBLIC_APP_URL). While it is the vercel.app
// address nothing below redirects; once it is the real domain, the old vercel.app address
// forwards there so Google sees one store, not two.
const publishedHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL || "").hostname.toLowerCase();
  } catch {
    return "";
  }
})();

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (hostname === `www.${canonicalHost}`) {
    const url = request.nextUrl.clone();
    url.hostname = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  const isOldVercelAddress = process.env.VERCEL_ENV === "production" && hostname.endsWith(".vercel.app") && publishedHost && !publishedHost.endsWith(".vercel.app");
  // API routes (payment webhooks) keep answering on the old address too.
  if (isOldVercelAddress && !request.nextUrl.pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = publishedHost;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
