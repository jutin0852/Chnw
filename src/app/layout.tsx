import type { Metadata, Viewport } from "next";
import { Bodoni_Moda } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "../components/store/cart-context";
import { getSiteUrl } from "@/lib/site-url";
import { GoogleAnalytics } from "../components/analytics/google-analytics";
import { BRAND } from "@/config/brand";

const displaySerif = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
    <html lang="en" className={displaySerif.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: BRAND.name,
          url: getSiteUrl(),
          logo: `${getSiteUrl()}/brand/favicon-192.png`,
          description: BRAND.description,
          areaServed: BRAND.areaServed,
          sameAs: [BRAND.social.instagram, BRAND.social.facebook, BRAND.social.tiktok].filter(Boolean),
        }) }} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
