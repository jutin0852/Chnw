import { BRAND } from "@/config/brand";
import { getSiteUrl } from "./site-url";

// Search and sharing helpers. Every absolute URL comes from getSiteUrl(), so moving to the real
// domain is one setting (NEXT_PUBLIC_APP_URL) and nothing here changes.

// Brand fonts uploaded to Cloudinary (authenticated raw files) for share-card text.
const CARD_SERIF = "chnw-bodoni-600.ttf";
const CARD_MONO = "chnw-courier-700.ttf";

/** Text for a Cloudinary text layer: commas and slashes are double-encoded, as its URL syntax needs. */
function layerText(text: string) {
  return encodeURIComponent(text).replace(/%2C/g, "%252C").replace(/%2F/g, "%252F");
}

/**
 * 1200x630 share card made by Cloudinary: brand red on the left with the CHNW wordmark, product
 * name and price; the product photo on the right. Shown by WhatsApp, Instagram, X and iMessage.
 * Prices are written "NGN" because the brand fonts have no naira sign.
 */
export function productShareImage(imageUrl: string, name: string, priceNaira: string) {
  const marker = "/image/upload/";
  if (!imageUrl.includes("res.cloudinary.com") || !imageUrl.includes(marker)) return imageUrl;
  const price = `NGN ${Math.round(Number(priceNaira)).toLocaleString("en-NG")}`;
  const layers = [
    "c_fill,g_auto,w_520,h_630",
    "c_lpad,g_east,w_1200,h_630,b_rgb:a40009",
    `l_text:${CARD_SERIF}_110:CHNW,co_white,g_north_west,x_70,y_64`,
    `l_text:${CARD_SERIF}_64:${layerText(name)},co_white,g_south_west,x_70,y_150,w_560,c_fit`,
    `l_text:${CARD_MONO}_34:${layerText(price)},co_white,g_south_west,x_72,y_84`,
    "f_jpg,q_auto",
  ];
  return imageUrl.replace(marker, `${marker}${layers.join("/")}/`);
}

type SeoProduct = {
  productName: string;
  slug: string;
  description: string | null;
  price: string;
  sku: string | null;
  unlimitedStock?: boolean;
  inventoryCount: number | null;
  inventoryMigrationStatus: string;
  variants: { isActive: boolean; inventoryCount: number }[];
  images: { imageUrl: string }[];
  category: { name: string; slug?: string } | null;
  materials?: string | null;
};

function available(product: SeoProduct) {
  if (product.inventoryMigrationStatus === "migrated") {
    return product.variants.some((variant) => variant.isActive && (product.unlimitedStock || variant.inventoryCount > 0));
  }
  return Boolean(product.unlimitedStock) || (product.inventoryCount ?? 0) > 0;
}

/** schema.org Product data so Google can show the price, availability and delivery time. */
export function productJsonLd(product: SeoProduct) {
  const site = getSiteUrl();
  const url = `${site}/product/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.description || `${product.productName} from ${BRAND.name}.`,
    url,
    sku: product.sku || undefined,
    image: product.images.map((image) => image.imageUrl).slice(0, 5),
    brand: { "@type": "Brand", name: BRAND.name },
    category: product.category?.name,
    material: product.materials || undefined,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: Number(product.price).toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability: available(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: BRAND.name },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "NG" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          // Pieces are made after the order: 5 to 7 working days to make, then delivery.
          handlingTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 7, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
        },
      },
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: `${site}${crumb.path}` })),
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so text can never close the tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** True only on the live production deployment; previews and local runs stay out of Google. */
export function isIndexable() {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : process.env.NODE_ENV === "production";
}
