import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "./cart-context";
import { formatStorePrice } from "./currency";
import { primaryProductAlt, primaryProductImage } from "./brand-assets";
import { shortName, sizeSummary } from "./catalog";
import { colourCard } from "@/config/colourways";

/**
 * Product card used on home and shop. The photo settles from a slight zoom on hover and the
 * second photo crossfades in; the label row reads like a work tag.
 */
export default function ProductCard({
  product,
  number,
  sizes = "(max-width: 767px) 50vw, 25vw",
  aspect = "aspect-[4/5]",
  priority = false,
  large = false,
  highPriority = false,
}: {
  product: StoreProduct;
  number?: string;
  sizes?: string;
  aspect?: string;
  priority?: boolean;
  large?: boolean;
  /** Only for the first one or two cards above the fold (LCP). */
  highPriority?: boolean;
}) {
  const [first, second] = product.images || [];
  const card = colourCard(product.productName, product.slug);
  return (
    <Link href={`/product/${product.slug}`} className="card group flex min-w-0 flex-col gap-3">
      <span className={`card-media block ${aspect}`}>
        <Image
          fill
          sizes={sizes}
          quality={80}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={highPriority ? "high" : undefined}
          src={first?.imageUrl || primaryProductImage}
          alt={first?.altText || product.productName || primaryProductAlt}
          className="object-cover"
        />
        {second && <Image fill sizes={sizes} quality={80} src={second.imageUrl} alt="" aria-hidden="true" className="card-alt object-cover" />}
      </span>
      <span className="flex flex-col gap-1.5">
        <span className="label text-[11px] text-stone">
          {[number, product.category?.name].filter(Boolean).join(" · ")}
        </span>
        <span className="flex items-baseline justify-between gap-3">
          <span className={`font-display leading-[1.1] transition-colors group-hover:text-thread ${large ? "text-[26px] sm:text-[30px]" : "text-[20px] sm:text-[22px]"}`}>
            {shortName(card.name)}
          </span>
          <span className="label shrink-0 text-[13px] tracking-[0.04em] text-ink">{formatStorePrice(product.price)}</span>
        </span>
        <span className="text-[13px] text-stone">{[card.ownSize ? "" : sizeSummary(product), card.options].filter(Boolean).join(" · ")}</span>
      </span>
    </Link>
  );
}
