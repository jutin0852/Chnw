"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "./cart-context";
import { primaryProductAlt, primaryProductImage } from "./brand-assets";
import { formatStorePrice } from "./currency";
import { multiplyNairaDecimal } from "@/lib/money";
import { sizeLabel } from "./catalog";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  fallbackImage: string;
  emptyContent: ReactNode;
  width?: "sm" | "md";
};

const editHref = (item: CartItem) =>
  `/product/${item.slug}?edit=1&size=${encodeURIComponent(item.size || "")}&quantity=${item.quantity}&color=${encodeURIComponent(item.customizations?.color || "")}&desiredLength=${encodeURIComponent(item.customizations?.desiredLength || "")}&customerHeight=${encodeURIComponent(item.customizations?.customerHeight || "")}&notes=${encodeURIComponent(item.customizations?.notes || "")}`;

export default function CartDrawer({ open, onClose, fallbackImage, emptyContent, width = "md" }: CartDrawerProps) {
  const { cart, cartCount, cartTotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-paper text-ink transition-transform duration-700 ease-cloth ${width === "sm" ? "max-w-sm" : "max-w-[440px]"} ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          <h2 className="font-display text-[32px] leading-none">
            Your bag <span className="label align-middle text-[14px] tracking-normal">({cartCount})</span>
          </h2>
          <button type="button" onClick={onClose} className="label draw grid h-11 place-items-center text-[12px]">Close</button>
        </div>

        <ol aria-label="Checkout steps" className="label flex items-center gap-2 px-5 pb-4 text-[11px]">
          <li className="text-thread" aria-current="step">Bag</li>
          <li aria-hidden="true" className="flex-1 border-t-2 border-dashed border-thread" />
          <li className="text-stone">Details</li>
          <li aria-hidden="true" className="flex-1 border-t-2 border-dashed border-[var(--line)]" />
          <li className="text-stone">Pay</li>
        </ol>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-[30px] leading-tight">Your bag is empty.</p>
            <p className="mt-2 text-[15px] text-stone">Every piece is cut after you order, so there is always one for you.</p>
            {emptyContent}
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto border-t border-[var(--line)] px-5">
              {cart.map((item) => (
                <li key={JSON.stringify([item.id, item.size || "", item.customizations || {}])} className="flex gap-4 border-b border-[var(--line)] py-4">
                  <Link href={editHref(item)} onClick={onClose} className="shrink-0" aria-label={`Edit ${item.productName}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.images?.[0]?.imageUrl || primaryProductImage || fallbackImage} alt={item.images?.[0]?.altText || primaryProductAlt} className="h-[120px] w-24 bg-mist object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex justify-between gap-3">
                      <Link href={editHref(item)} onClick={onClose} className="font-display text-[19px] leading-[1.15] hover:text-thread">{item.productName}</Link>
                      <span className="label shrink-0 text-[13px] tracking-[0.02em]">{formatStorePrice(multiplyNairaDecimal(item.price, item.quantity))}</span>
                    </div>
                    <p className="label text-[11px] text-stone">{sizeLabel(item.size)}</p>
                    {item.customizations?.notes && <p className="text-[12px] text-stone">Note: {item.customizations.notes}</p>}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[var(--line)]">
                        <button type="button" onClick={() => updateQuantity(item.id, -1, item.size, item.customizations)} className="grid h-9 w-10 place-items-center" aria-label={`Remove one ${item.productName}`}>−</button>
                        <span className="label min-w-4 text-center text-[13px]">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1, item.size, item.customizations)} className="grid h-9 w-10 place-items-center" aria-label={`Add one ${item.productName}`}>+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id, item.size, item.customizations)} className="min-h-9 text-[13px] underline underline-offset-4 hover:text-thread">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 border-t border-[var(--line)] px-5 pb-6 pt-4">
              <div className="border border-ink p-3">
                <p className="label text-[11px] text-thread">Made for you</p>
                <p className="mt-1 text-[14px] leading-[1.5]">Your pieces are made after you pay and arrive in 5 to 7 business days.</p>
              </div>
              <div className="flex justify-between text-[16px]">
                <span>Subtotal</span>
                <span className="label text-[15px] tracking-[0.02em]">{formatStorePrice(cartTotal)}</span>
              </div>
              <p className="text-[13px] text-stone">Delivery is calculated at the next step.</p>
              <Link href="/checkout" onClick={onClose} className="pill pill--red w-full !py-[17px] text-[16px]">Checkout · pay with Paystack</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
