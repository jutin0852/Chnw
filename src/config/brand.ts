/**
 * Single source of truth for everything brand-specific.
 * Change values here (and the colour tokens at the top of globals.css)
 * instead of hunting through components.
 *
 * Values marked TODO are placeholders that still need CHNW's real details.
 */
export const BRAND = {
  name: "CHNW",
  shortName: "CHNW",
  /** Short line used under the logo, in metadata and on the home page. */
  tagline: "Slow fashion, reworked.",
  description: "CHNW is a Nigerian slow-fashion label making small-batch pieces from reworked denim.",
  keywords: ["CHNW", "slow fashion", "reworked denim", "upcycled fashion", "Nigerian fashion"],

  /** Production domain, without protocol or www. */
  domain: "chnw.ng", // TODO: confirm the domain CHNW will launch on
  locale: "en_NG",
  areaServed: "NG",

  social: {
    instagram: "https://www.instagram.com/chnw.ng/",
    instagramHandle: "@chnw.ng",
    facebook: "", // TODO: add if CHNW has one; the footer hides empty links
    tiktok: "", // TODO
  },

  /** Printed on invoices and receipts. */
  contact: {
    addressLines: ["TODO: CHNW studio address", "Lagos, Nigeria"],
    phones: "Tel: TODO",
    email: "", // TODO
  },

  /** Hex colours for places CSS variables cannot reach (emails, PDFs, SVG icons). Keep in sync with globals.css. */
  colors: {
    accent: "#a40009",
    accentStrong: "#7a0007",
    tint: "#f3f1ee",
    ink: "#141210",
    canvas: "#ffffff",
  },
} as const;

/**
 * Products in the category with this slug are made to order: the product page shows a
 * WhatsApp consultation button instead of "Add to bag", and checkout rejects them.
 * Create a category with this slug in the admin to use it.
 */
export const MADE_TO_ORDER_CATEGORY_SLUG = "made-to-order";

export const canonicalOrigin = `https://${BRAND.domain}`;
