import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "../components/store/cart-context";
import StoreMotion from "../components/store/store-motion";
import { getSiteUrl } from "@/lib/site-url";
import { GoogleAnalytics } from "../components/analytics/google-analytics";
import { BRAND } from "@/config/brand";
import { isIndexable, jsonLd } from "@/lib/seo";

// Fonts are bundled in ./fonts (not fetched from Google at build time, so builds never depend on it).
// Display: Bodoni Moda (the serif in CHNW's own graphics). Labels: Courier Prime (typewriter).
// Reading text: Instrument Sans.
const displaySerif = localFont({
  src: [
    { path: "./fonts/bodoni-normal-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/bodoni-normal-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/bodoni-normal-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/bodoni-italic-400.woff2", weight: "400", style: "italic" },
    { path: "./fonts/bodoni-italic-500.woff2", weight: "500", style: "italic" },
    { path: "./fonts/bodoni-italic-600.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
});
const typewriter = localFont({
  src: [
    { path: "./fonts/courier-normal-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/courier-normal-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-courier",
  display: "swap",
});
const sans = localFont({
  src: [{ path: "./fonts/instrument-normal-400-600.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-instrument",
  display: "swap",
});

// Before first paint: .js and .motion gate the hidden-until-revealed styles; .loader-seen skips
// the home loader after the first visit in a session.
const flags = `(function(){var d=document.documentElement;d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion');try{if(sessionStorage.getItem('chnw-loader-seen'))d.classList.add('loader-seen')}catch(e){}})()`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Edge-to-edge on notched phones; headers pad themselves with env(safe-area-inset-top).
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const pageTitle = `${BRAND.name} | ${BRAND.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  appleWebApp: { capable: true, title: BRAND.shortName, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
  title: {
    default: pageTitle,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/favicon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: [{ url: "/brand/favicon-32.png", type: "image/png" }],
    apple: [{ url: "/brand/favicon-192.png", type: "image/png", sizes: "192x192" }],
  },
  keywords: [...BRAND.keywords],
  // Previews stay out of Google; the live store is indexed.
  robots: isIndexable() ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : { index: false, follow: false },
  // Paste the code from Google Search Console / Bing Webmaster Tools into these variables once the domain is live.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    type: "website",
    locale: BRAND.locale,
    siteName: BRAND.name,
    title: pageTitle,
    description: BRAND.description,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: BRAND.description,
    images: ["/brand/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${typewriter.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a className="skip-link" href="#main">Skip to content</a>
        <div id="curtain" aria-hidden="true">
          <div className="curtain__panel" />
        </div>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ClothingStore",
              "@id": `${getSiteUrl()}/#store`,
              name: BRAND.name,
              url: getSiteUrl(),
              logo: `${getSiteUrl()}/brand/favicon-192.png`,
              image: `${getSiteUrl()}/brand/og-image.png`,
              description: BRAND.description,
              areaServed: BRAND.areaServed,
              currenciesAccepted: "NGN",
              sameAs: [BRAND.social.instagram, BRAND.social.facebook, BRAND.social.tiktok].filter(Boolean),
            },
            { "@type": "WebSite", "@id": `${getSiteUrl()}/#website`, name: BRAND.name, url: getSiteUrl(), publisher: { "@id": `${getSiteUrl()}/#store` } },
          ],
        }) }} />
        <CartProvider>{children}</CartProvider>
        <StoreMotion />
      </body>
    </html>
  );
}
