"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatStorePrice } from "./currency";
import { shortName } from "./catalog";
import { searchItems, type SearchItem } from "./search";

export type SearchCategory = { slug: string; name: string };
export type { SearchItem };

const MAX_RESULTS = 6;

/**
 * Search that opens over the page (a side panel on computers, full screen on phones), after the
 * pattern of H&M, Selfridges and Urban Outfitters: categories to tap before typing, then matching
 * pieces with photo and price as you type, and "See all results" for the full shop grid.
 */
export default function SearchPanel({ open, onClose, items, categories }: { open: boolean; onClose: () => void; items: SearchItem[]; categories: SearchCategory[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchItems(items, query), [items, query]);
  const q = query.trim();

  useEffect(() => {
    if (!open) return;
    // Focus after the slide-in starts, so phones open the keyboard.
    const t = setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function seeAll() {
    if (!q) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-ink/40 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-y-0 right-0 z-[60] flex w-full flex-col bg-paper text-ink transition-transform duration-500 ease-cloth sm:w-[460px] sm:border-l sm:border-[var(--line)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            seeAll();
          }}
          className="flex items-center gap-3 border-b border-ink px-5 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, colours, categories"
            aria-label="Search the shop"
            enterKeyHint="search"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent py-2 text-[17px] outline-none placeholder:text-stone/70 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); input.current?.focus(); }} className="label py-2 text-[11px] text-stone hover:text-ink">
              Clear
            </button>
          )}
          <button type="button" onClick={onClose} className="label grid h-11 min-w-11 place-items-center text-[12px]">
            Close
          </button>
        </form>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {!q ? (
            <>
              <p className="label mb-4 text-[11px] text-stone">Popular searches</p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      onClick={onClose}
                      className="label inline-block rounded-full border border-[var(--line)] px-4 py-2.5 text-[12px] transition-colors hover:border-ink"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/shop" onClick={onClose} className="label inline-block rounded-full border border-ink bg-ink px-4 py-2.5 text-[12px] text-paper">
                    All pieces
                  </Link>
                </li>
              </ul>
            </>
          ) : results.length === 0 ? (
            <div className="flex flex-col gap-3 pt-4">
              <p className="font-display text-[26px] leading-tight">Nothing for &ldquo;{q}&rdquo;</p>
              <p className="text-[15px] leading-[1.6] text-stone">Try a piece name, a colour or a category, like &ldquo;skirt&rdquo; or &ldquo;tote&rdquo;.</p>
              <Link href="/shop" onClick={onClose} className="label draw mt-2 w-fit py-1 text-[12px]">Browse all pieces</Link>
            </div>
          ) : (
            <>
              <p className="label mb-4 text-[11px] text-stone" aria-live="polite">
                {results.length} {results.length === 1 ? "piece" : "pieces"}
              </p>
              <ul className="flex flex-col">
                {results.slice(0, MAX_RESULTS).map((item) => (
                  <li key={item.slug}>
                    <Link href={`/product/${item.slug}`} onClick={onClose} className="group flex items-center gap-4 border-b border-[var(--line)] py-3">
                      <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-mist">
                        {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        {item.category && <span className="label text-[10px] text-stone">{item.category}</span>}
                        <span className="font-display text-[19px] leading-tight transition-colors group-hover:text-thread">{shortName(item.name)}</span>
                      </span>
                      <span className="label shrink-0 text-[12px] tracking-[0.04em]">{formatStorePrice(item.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={seeAll} className="pill pill--ink mt-6 w-full">
                See all results for &ldquo;{q}&rdquo;
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
