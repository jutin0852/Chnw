"use client";

import Link from "next/link";
import type { CartFeedback } from "./use-cart-feedback";
import { formatStorePrice } from "./currency";
import { multiplyNairaDecimal } from "@/lib/money";
import { sizeLabel } from "./catalog";

export default function CartAddToast({
  feedback,
  bagQuantity,
  onDismiss,
  onViewBag,
}: {
  feedback: CartFeedback | null;
  bagQuantity: number;
  onDismiss: () => void;
  onViewBag: () => void;
}) {
  if (!feedback?.success) return null;

  const image = feedback.product.images?.[0];
  return (
    <>
      <button aria-label="Dismiss added to bag message" className="fixed inset-0 z-40 cursor-default bg-transparent" onClick={onDismiss} />
      <section
        aria-live="polite"
        className="rise fixed inset-x-3 bottom-3 z-50 border border-ink bg-paper p-4 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:w-[380px]"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="label text-[12px] text-thread">Added to your bag</p>
          <button onClick={onDismiss} className="label draw text-[11px]">Close</button>
        </div>
        <div className="stitch my-3" />
        <div className="flex gap-3 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image && <img src={image.imageUrl} alt={image.altText || feedback.product.productName} className="h-20 w-16 bg-mist object-cover" />}
          <div className="min-w-0 flex-1">
            <p className="font-display text-[20px] leading-tight">{feedback.product.productName}</p>
            <p className="label mt-1 text-[11px] text-stone">
              {sizeLabel(feedback.size)} · {bagQuantity} in your bag
            </p>
            <p className="label mt-2 text-[13px] tracking-[0.04em]">{formatStorePrice(multiplyNairaDecimal(feedback.product.price, feedback.quantity))}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onViewBag} className="pill pill--line !px-4 !py-3 text-[14px]">View bag</button>
          <Link href="/checkout" onClick={onDismiss} className="pill pill--red !px-4 !py-3 text-[14px]">Checkout</Link>
        </div>
      </section>
    </>
  );
}
