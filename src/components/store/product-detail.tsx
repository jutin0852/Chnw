"use client";

import { MADE_TO_ORDER_CATEGORY_SLUG } from "@/config/brand";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { primaryProductAlt, primaryProductImage } from "./brand-assets";
import { formatStorePrice } from "./currency";
import CartAddToast from "./cart-add-toast";
import ReelVideo from "./reel-video";
import { useCart, type StoreProduct } from "./cart-context";
import { useCartFeedback } from "./use-cart-feedback";
import { UK_SIZE_CHART, sizeLabel, sizeValue } from "./catalog";
import type { Film } from "@/config/films";
import { optionGroupFor } from "@/config/colourways";

type DetailProduct = StoreProduct & {
  sizes?: string[] | null;
  materials?: string | null;
  careInstructions?: string | null;
};

export default function ProductDetail({ product, number, film }: { product: DetailProduct; number?: string; film?: Film }) {
  const searchParams = useSearchParams();
  const group = optionGroupFor(product.slug);
  const editMode = searchParams.get("edit") === "1";
  const realSizes = (product.sizes || []).filter((s) => s && s !== "ONE_SIZE");
  const initialSize = searchParams.get("size") || (realSizes.length ? "" : product.sizes?.[0] || "");
  const initialQuantity = Math.max(1, Number(searchParams.get("quantity")) || 1);
  const initialCustomizations = {
    color: searchParams.get("color") || undefined,
    desiredLength: searchParams.get("desiredLength") || undefined,
    customerHeight: searchParams.get("customerHeight") || undefined,
    notes: searchParams.get("notes") || undefined,
  };
  const gallery = product.images?.length ? product.images : [{ id: 0, imageUrl: primaryProductImage, altText: primaryProductAlt }];
  const [size, setSize] = useState(initialSize);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [notes, setNotes] = useState(initialCustomizations.notes || "");
  const { cart, removeItem, setBagOpen } = useCart();
  const { feedback, addWithFeedback, dismissFeedback } = useCartFeedback();
  const selectedVariant = product.variants.find((variant) => variant.size === (size || "ONE_SIZE"));
  const anyStock = product.inventoryMigrationStatus === "migrated" ? product.variants.some((v) => v.isActive && v.inventoryCount > 0) : (product.inventoryCount ?? 0) > 0;
  const stock = product.inventoryMigrationStatus === "migrated" ? (selectedVariant?.inventoryCount ?? 0) : (product.inventoryCount ?? 0);
  const isCustomWear = product.category?.slug === MADE_TO_ORDER_CATEGORY_SLUG;
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello CHNW, I have a question about the ${product.productName}.`)}`
    : undefined;
  const needsSize = realSizes.length > 0;
  const isAvailable = needsSize && !size ? anyStock : stock > 0;
  const chosenRow = size ? UK_SIZE_CHART.find(([s]) => s === sizeValue(size)) : undefined;
  const bagQuantity = cart
    .filter((item) => item.id === product.id && item.size === size && JSON.stringify(item.customizations || {}) === JSON.stringify(feedback?.customizations || {}))
    .reduce((total, item) => total + item.quantity, 0);

  function addProduct() {
    if (needsSize && !size) {
      setSizeError(true);
      document.getElementById("size-picker")?.scrollIntoView({ block: "center" });
      return;
    }
    if (editMode) removeItem(product.id, initialSize, initialCustomizations);
    addWithFeedback(product, size, quantity, { notes: notes.trim() || undefined });
  }

  const ctaLabel = feedback?.success
    ? editMode ? "Bag updated" : "Added to bag"
    : !isAvailable ? "Sold out" : editMode ? "Update bag" : needsSize && !size ? "Choose a size" : `Add${size && needsSize ? ` ${sizeLabel(size)}` : ""} to bag · ${formatStorePrice(product.price)}`;

  const media = [
    { kind: "image" as const, image: gallery[0] },
    ...(film ? [{ kind: "film" as const, film }] : []),
    ...gallery.slice(1).map((image) => ({ kind: "image" as const, image })),
  ];

  return (
    <>
      <div className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-8 lg:px-12">
        <nav aria-label="Breadcrumb" className="label flex gap-2 text-[12px] text-stone">
          <Link href="/shop" className="draw py-1">All pieces</Link>
          {product.category?.slug && (
            <>
              <span aria-hidden="true">/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="draw py-1">{product.category.name}</Link>
            </>
          )}
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-0 pb-16 pt-5 sm:px-8 lg:grid-cols-[minmax(0,7fr)_minmax(380px,5fr)] lg:gap-14 lg:px-12 lg:pb-24">
        <ul aria-label="Gallery" className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:px-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {media.map((item, i) => (
            <li
              key={item.kind === "film" ? "film" : `${item.image.id}-${i}`}
              className={`relative w-[86vw] shrink-0 snap-center overflow-hidden bg-mist sm:w-[60vw] lg:w-auto ${i === 0 ? "aspect-[4/5] lg:col-span-2" : "aspect-[4/5] lg:aspect-[9/16]"}`}
            >
              {item.kind === "film" ? (
                <>
                  <ReelVideo code={item.film.code} label={item.film.alt} />
                  <span className="label pointer-events-none absolute left-3 top-3 bg-paper px-2.5 py-1.5 text-[11px]">Film · in motion</span>
                </>
              ) : (
                <Image
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  sizes={i === 0 ? "(max-width: 1023px) 86vw, 58vw" : "(max-width: 1023px) 86vw, 29vw"}
                  quality={80}
                  src={item.image.imageUrl}
                  alt={item.image.altText || product.productName}
                  className="object-cover"
                />
              )}
            </li>
          ))}
        </ul>

        <aside aria-label="Choose and buy" className="flex flex-col gap-7 px-4 sm:px-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-3">
            <p className="label text-[12px] text-thread">{[number, isCustomWear ? "Made for you" : "Made to order"].filter(Boolean).join(" · ")}</p>
            <h1 className="text-[44px] leading-[0.98] sm:text-[58px]">{product.productName}</h1>
            {!isCustomWear && <p className="label text-[20px] tracking-[0.02em]">{formatStorePrice(product.price)}</p>}
            {group && (
              <div role="group" aria-label={group.label} className="flex flex-wrap items-center gap-2 pt-1">
                <span className="label mr-1 text-[12px] text-stone">{group.label}</span>
                {group.items.map((item) => {
                  const current = item.slug === product.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/product/${item.slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`label rounded-full border px-4 py-2.5 text-[12px] transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 ${current ? "border-ink bg-ink text-paper" : "border-[var(--line)] hover:border-ink"}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
            <p className="max-w-[520px] text-[16px] leading-[1.65] text-[#3d3832]">{product.description || "A one-of-a-kind piece, reworked by hand in small batches."}</p>
          </div>

          {isCustomWear ? (
            <div className="flex flex-col gap-4 border-y border-ink py-6">
              <p className="label text-[12px]">How custom orders work</p>
              <p className="text-[15px] leading-[1.6] text-[#3d3832]">This piece is made to order around you. Message us on WhatsApp to agree your size, timing and details.</p>
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="pill pill--red w-full">Enquire on WhatsApp</a>
              ) : (
                <button disabled className="pill pill--ink w-full">WhatsApp enquiries coming soon</button>
              )}
            </div>
          ) : (
            <>
              {needsSize && (
                <fieldset id="size-picker" className="flex flex-col gap-3">
                  <legend className="mb-3 flex w-full items-baseline justify-between gap-4 text-[14px]">
                    <span>UK size{size ? <strong className="ml-2 font-semibold">{sizeValue(size)}</strong> : null}</span>
                    {sizeError && !size && <span className="label text-[11px] text-thread" role="alert">Choose a size first</span>}
                  </legend>
                  <div className="grid grid-cols-5 gap-2">
                    {realSizes.map((item) => {
                      const v = product.variants.find((variant) => variant.size === item);
                      const ok = product.inventoryMigrationStatus !== "migrated" || Boolean(v?.isActive && v.inventoryCount > 0);
                      const active = size === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          disabled={!ok}
                          aria-pressed={active}
                          aria-label={`${sizeLabel(item)}${ok ? "" : ", sold out"}`}
                          onClick={() => {
                            setSize(item);
                            setSizeError(false);
                          }}
                          className={`label h-12 border text-[15px] tracking-normal transition-colors duration-300 disabled:cursor-not-allowed disabled:text-stone/50 disabled:line-through ${active ? "border-ink bg-ink text-paper" : "border-[var(--line)] hover:border-ink"}`}
                        >
                          {sizeValue(item)}
                        </button>
                      );
                    })}
                  </div>
                  <p className="label text-[12px] text-stone" aria-live="polite">
                    {chosenRow ? `UK ${chosenRow[0]} · bust ${chosenRow[1]} in · waist ${chosenRow[2]} in · hips ${chosenRow[3]} in` : "Measurements show here when you pick a size"}
                  </p>
                  <details className="group">
                    <summary className="label draw w-fit cursor-pointer list-none text-[12px]">Full size chart</summary>
                    <div className="mt-4 overflow-x-auto border border-ink">
                      <table className="min-w-full text-left text-[13px]">
                        <thead className="label bg-mist text-[11px]">
                          <tr><th className="px-3 py-2.5">UK</th><th className="px-3 py-2.5">Bust</th><th className="px-3 py-2.5">Waist</th><th className="px-3 py-2.5">Hips</th></tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--line)] font-mono">
                          {UK_SIZE_CHART.map(([s, bust, waist, hips]) => (
                            <tr key={s} className={size && s === sizeValue(size) ? "bg-[#f7eceb]" : ""}><td className="px-3 py-2">{s}</td><td className="px-3 py-2">{bust} in</td><td className="px-3 py-2">{waist} in</td><td className="px-3 py-2">{hips} in</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-[13px] leading-[1.6] text-stone">Body measurements in inches. Between sizes? Choose the larger one, or add a note and we will cut to fit.</p>
                  </details>
                </fieldset>
              )}

              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border border-ink p-4 font-mono text-[13px]">
                <dt className="text-stone">Made in</dt><dd>5 to 7 business days</dd>
                <dt className="text-stone">Material</dt><dd>{product.materials || "Made by hand"}</dd>
                <dt className="text-stone">If it&apos;s not right</dt><dd>Adjusted within 30 days</dd>
              </dl>

              <details className="border-t border-[var(--line)] pt-4" open={Boolean(notes)}>
                <summary className="label draw w-fit cursor-pointer list-none text-[12px]">Add a note for the workroom</summary>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  maxLength={500}
                  aria-label="Note for the workroom"
                  placeholder="Length, fit, or anything we should know"
                  className="mt-3 w-full resize-none border border-[var(--line)] bg-paper px-3 py-3 text-[15px] outline-none placeholder:text-stone/60 focus:border-ink"
                />
              </details>

              <div className="flex items-center justify-between">
                <span className="label text-[12px]">Quantity</span>
                <div className="flex items-center rounded-full border border-[var(--line)]">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-11 w-11 place-items-center rounded-full text-[18px] transition-colors hover:bg-mist hover:text-thread" aria-label="Decrease quantity">−</button>
                  <span className="label w-6 text-center text-[14px]" aria-live="polite">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(Math.max(stock, 1), quantity + 1))} className="grid h-11 w-11 place-items-center rounded-full text-[18px] transition-colors hover:bg-mist hover:text-thread" aria-label="Increase quantity">+</button>
                </div>
              </div>

              <div className="hidden flex-col gap-3 lg:flex">
                <button type="button" disabled={!isAvailable} onClick={addProduct} className="pill pill--red w-full !py-[18px] text-[16px]">{ctaLabel}</button>
                {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" className="pill pill--line w-full">Ask about it on WhatsApp</a>}
              </div>
            </>
          )}

          <div className="flex flex-col border-t border-[var(--line)]">
            {[
              ["Details and care", `${product.materials ? `${product.materials}.` : "Made by hand."} ${product.careInstructions || "Follow the care label to keep the fabric and finish at their best."}`],
              ["Delivery", "Made and delivered in 5 to 7 business days after you order. Delivery is paid by the customer and shown at checkout."],
              ["Adjustments, not refunds", "Bring a piece back within 30 days and we adjust or remake it. Sale and customised pieces are final. Upcycled pieces can differ slightly from the photos."],
            ].map(([title, copy]) => (
              <details key={title} className="group border-b border-[var(--line)] py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px]">
                  {title}
                  <span aria-hidden="true" className="label text-[14px] transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[480px] text-[14px] leading-[1.65] text-stone">{copy}</p>
              </details>
            ))}
          </div>
        </aside>
      </section>

      {!isCustomWear && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-paper/95 px-3 pb-4 pt-3 backdrop-blur-sm lg:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Ask about it on WhatsApp" className="label grid h-[52px] shrink-0 place-items-center rounded-full border border-ink px-4 text-[11px]">Ask</a>
            )}
            <button type="button" disabled={!isAvailable} onClick={addProduct} className="pill pill--red h-[52px] flex-1 !px-4 !py-0 text-[15px]">{ctaLabel}</button>
          </div>
        </div>
      )}

      <CartAddToast feedback={feedback} bagQuantity={bagQuantity} onDismiss={dismissFeedback} onViewBag={() => { dismissFeedback(); setBagOpen(true); }} />
    </>
  );
}
