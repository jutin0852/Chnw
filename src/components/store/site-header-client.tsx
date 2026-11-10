"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { startScroll, stopScroll } from "@/engine";
import { useCart } from "./cart-context";
import CartDrawer from "./cart-drawer";
import { primaryProductImage } from "./brand-assets";

export type NavCategory = { slug: string; name: string; count: number; image?: string };

const primary = [
  { href: "/shop", label: "Shop all" },
  { href: "/#workroom", label: "The Workroom" },
];

const menu = [
  { href: "/shop", label: "All pieces" },
  { href: "/shop?category=bags", label: "Bags" },
  { href: "/shop?category=skirts", label: "Skirts" },
  { href: "/shop?category=dresses", label: "Dresses" },
  { href: "/shop?category=sets", label: "Sets" },
  { href: "/shop?category=tops", label: "Tops" },
  { href: "/shop?category=pants", label: "Pants" },
  { href: "/#workroom", label: "The Workroom" },
];

export default function SiteHeaderClient({ overlay = false, categories = [] }: { overlay?: boolean; categories?: NavCategory[] }) {
  const pathname = usePathname();
  const { cartCount, bagOpen, setBagOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  // Close the collection panel on navigation, Escape or a click outside the header.
  useEffect(() => setCollectionOpen(false), [pathname]);
  useEffect(() => {
    if (!collectionOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCollectionOpen(false);
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setCollectionOpen(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onDown);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    };
  }, [collectionOpen]);

  useEffect(() => {
    if (menuOpen || bagOpen) stopScroll();
    else startScroll();
  }, [menuOpen, bagOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const tone = overlay ? "text-white" : "text-ink";

  return (
    <>
      <header
        ref={headerRef}
        className={
          overlay
            ? "absolute inset-x-0 top-0 z-30 text-white"
            : "sticky top-0 z-30 border-b border-[var(--line)] bg-paper/95 text-ink backdrop-blur-sm"
        }
      >
        {overlay && (
          <p className="label border-b border-white/20 px-4 py-2.5 text-center text-[11px] sm:text-xs">
            <span className="sm:hidden">Made to order · 5 to 7 business days</span>
            <span className="hidden sm:inline">Handmade · made to order · ready in 5 to 7 business days</span>
          </p>
        )}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 py-2 sm:px-6 lg:px-10 lg:py-4">
          <nav aria-label="Main" className="hidden flex-wrap items-center gap-x-7 gap-y-2 lg:flex">
            {categories.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSeen(true);
                  setCollectionOpen((o) => !o);
                }}
                aria-expanded={collectionOpen}
                aria-controls="collection-panel"
                className="label draw flex items-center gap-2 py-1 text-[13px]"
              >
                Collection
                <span aria-hidden="true" className={`inline-block text-[9px] transition-transform duration-500 ease-cloth ${collectionOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
            )}
            {primary.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.href === "/shop" && pathname === "/shop" ? "page" : undefined}
                className="label draw py-1 text-[13px]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="label grid h-11 min-w-11 place-items-center px-2 text-[12px] lg:hidden"
          >
            Menu
          </button>

          <Link href="/" aria-label="CHNW home" className={`font-display text-[22px] font-semibold tracking-[0.16em] transition-[letter-spacing,color] duration-700 ease-cloth hover:tracking-[0.24em] hover:text-thread sm:text-[26px] ${tone}`}>
            CHNW
          </Link>

          <div className="flex items-center justify-end gap-x-6">
            <Link href="/shop#search" className="label draw hidden py-1 text-[13px] lg:inline">Search</Link>
            <Link href="/account" className="label draw hidden py-1 text-[13px] lg:inline">Account</Link>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="label draw grid h-11 min-w-11 place-items-center px-2 text-[12px] lg:h-7 lg:min-w-0 lg:px-0 lg:text-[13px]"
              aria-label={`Open bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            >
              Bag ({cartCount})
            </button>
          </div>
        </div>
        {categories.length > 0 && (
          <div
            id="collection-panel"
            inert={!collectionOpen}
            className={`absolute inset-x-0 top-full hidden border-b border-[var(--line)] bg-paper text-ink transition-[clip-path] duration-500 ease-cloth lg:block ${collectionOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}
          >
            <div className="mx-auto grid max-w-[1500px] grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 px-10 py-10">
              <ul className="border-t border-ink" onMouseLeave={() => setActive(0)}>
                {categories.map((c, i) => (
                  <li key={c.slug}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="index-row flex items-baseline justify-between gap-6 border-b border-[var(--line)] py-4"
                    >
                      <span className="index-name font-display text-[44px] leading-none">{c.name}</span>
                      <span className="label text-[12px] text-stone">{String(c.count).padStart(2, "0")} {c.count === 1 ? "piece" : "pieces"}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/shop" className="label draw mt-5 inline-block py-1 text-[13px]">See all pieces</Link>
                </li>
              </ul>
              <div className="relative aspect-[4/3] max-h-[380px] self-start overflow-hidden bg-mist">
                {seen &&
                  categories.map((c, i) =>
                    c.image ? (
                      <Image
                        key={c.slug}
                        src={c.image}
                        alt=""
                        fill
                        sizes="480px"
                        loading="eager"
                        className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
                      />
                    ) : null,
                  )}
              </div>
            </div>
          </div>
        )}
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        data-lenis-prevent
        className={`fixed inset-0 z-[60] flex flex-col bg-ink text-paper transition-[clip-path] duration-700 ease-cloth lg:hidden ${menuOpen ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}
      >
        <div className="flex items-center justify-between px-2 py-2">
          <span className="label px-2 text-[12px] text-white/60">Menu</span>
          <button type="button" onClick={() => setMenuOpen(false)} className="label grid h-11 min-w-11 place-items-center px-2 text-[12px]">
            Close
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-5">
          {menu.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-4 py-1.5 font-display text-[40px] leading-[1.05] transition-colors hover:text-[#e8a3a6]"
            >
              <span className="label w-6 text-[11px] text-white/45">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-between border-t border-white/15 px-5 py-5">
          <Link href="/account" onClick={() => setMenuOpen(false)} className="label py-2 text-[12px]">Account</Link>
          <a href="https://www.instagram.com/chnw.ng/" target="_blank" rel="noreferrer" className="label py-2 text-[12px]">@chnw.ng</a>
        </div>
      </div>

      <CartDrawer
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        fallbackImage={primaryProductImage}
        emptyContent={
          <Link href="/shop" onClick={() => setBagOpen(false)} className="pill pill--ink mt-8">
            Browse all pieces
          </Link>
        }
      />
    </>
  );
}
