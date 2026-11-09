import { NextRequest, NextResponse } from "next/server";
import { BRAND } from "@/config/brand";

const canonicalHost = BRAND.domain;

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  if (hostname === `www.${canonicalHost}`) {
    const url = request.nextUrl.clone();
    url.hostname = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
