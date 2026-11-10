"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StoreProduct } from "./cart-context";
import ProductCard from "./product-card";
import ReelVideo from "./reel-video";
import { parseNairaToKobo } from "@/lib/money";
import { formatStorePrice } from "./currency";
import { shortName, sizeValue } from "./catalog";

type PriceRange = "all" | "under-50000" | "50000-100000" | "over-100000";
type SortOrder = "newest" | "price-low" | "price-high";
type Feature = { code: string; alt: string; product: StoreProduct };

const prices: [PriceRange, string][] = [
  ["all", "Any price"],
  ["under-50000", "Under ₦50k"],
  ["50000-100000", "₦50k to ₦100k"],
  ["over-100000", "Over ₦100k"],
];

export default function ShopGrid({
  products,
  numbers,
  initialCategory,
  feature,
}: {
  products: StoreProduct[];
  numbers: Record<string, string>;
  initialCategory: string;
  feature?: Feature;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("all");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => p.category?.slug && seen.set(p.category.slug, p.category.name));
    return [...seen.entries()];
  }, [products]);

  const sizes = useMemo(() => {
    const all = new Set(products.flatMap((p) => p.sizes || []).filter((s) => s !== "ONE_SIZE"));
    return [...all].sort((a, b) => Number(sizeValue(a)) - Number(sizeValue(b)));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const price = parseNairaToKobo(p.price);
      return (
        (category === "all" || p.category?.slug === category) &&
        (!q || p.productName.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.category?.name.toLowerCase().includes(q)) &&
        (size === "all" || p.sizes?.includes(size)) &&
        (priceRange === "all" ||
          (priceRange === "under-50000" && price < BigInt(5000000)) ||
          (priceRange === "50000-100000" && price >= BigInt(5000000) && price <= BigInt(10000000)) ||
          (priceRange === "over-100000" && price > BigInt(10000000)))
      );
    });
    if (sortOrder === "newest") return list;
    return [...list].sort((a, b) => {
      const d = parseNairaToKobo(a.price) - parseNairaToKobo(b.price);
      const n = d < BigInt(0) ? -1 : d > BigInt(0) ? 1 : 0;
      return sortOrder === "price-low" ? n : -n;
    });
  }, [category, priceRange, products, query, size, sortOrder]);

  function pickCategory(slug: string) {
    setCategory(slug);
    // Update the address bar without a server round trip; the grid filters on the client.
    window.history.replaceState(null, "", slug === "all" ? "/shop" : `/shop?category=${slug}`);
  }

  function reset() {
    pickCategory("all");
    setQuery("");
    setSize("all");
    setPriceRange("all");
  }

  const activeName = category === "all" ? "All pieces" : categories.find(([slug]) => slug === category)?.[1] || "All pieces";
  const showFeature = feature && category === "all" && !query && size === "all" && priceRange === "all";
  const chip = (active: boolean) =>
    `label rounded-full border px-4 py-2.5 text-[12px] transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 ${active ? "border-ink bg-ink text-paper hover:border-thread hover:bg-thread" : "border-[var(--line)] hover:border-ink"}`;

  return (
    <>
      <section className="mx-auto max-w-[1500px] px-4 pb-8 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="label text-[12px] text-stone">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} · all made to order
            </p>
            <h1 className="text-[52px] leading-[0.95] sm:text-[88px]">{activeName}</h1>
          </div>
          <label id="search" className="flex w-full items-center gap-3 border-b border-ink pb-2 sm:w-72">
            <span className="label text-[12px]">Search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Skirt, tote, denim"
              className="w-full bg-transparent text-[16px] outline-none placeholder:text-stone/70"
              aria-label="Search the collection"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-y border-[var(--line)] py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
            <button type="button" aria-pressed={category === "all"} onClick={() => pickCategory("all")} className={`shrink-0 ${chip(category === "all")}`}>All</button>
            {categories.map(([slug, name]) => (
              <button key={slug} type="button" aria-pressed={category === slug} onClick={() => pickCategory(slug)} className={`shrink-0 ${chip(category === slug)}`}>
                {name}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-6">
            <button type="button" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} className="label draw py-1 text-[12px]">
              {filtersOpen ? "Hide filters" : "Size and price"}
            </button>
            <label className="label flex items-center gap-2 text-[12px]">
              Sort
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)} className="border-b border-ink bg-transparent py-1 font-sans text-[14px] normal-case tracking-normal outline-none">
                <option value="newest">Newest</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
            </label>
          </div>
        </div>

        {filtersOpen && (
          <div className="grid gap-6 border-b border-[var(--line)] py-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <fieldset>
              <legend className="label mb-3 text-[12px] text-stone">UK size</legend>
              <div className="flex flex-wrap gap-2">
                <button type="button" aria-pressed={size === "all"} onClick={() => setSize("all")} className={chip(size === "all")}>Any</button>
                {sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={`min-w-11 ${chip(size === s)}`}>{sizeValue(s)}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="label mb-3 text-[12px] text-stone">Price</legend>
              <div className="flex flex-wrap gap-2">
                {prices.map(([value, text]) => (
                  <button key={value} type="button" aria-pressed={priceRange === value} onClick={() => setPriceRange(value)} className={chip(priceRange === value)}>{text}</button>
                ))}
              </div>
            </fieldset>
            <button type="button" onClick={reset} className="label draw justify-self-start text-[12px] text-stone">Clear all</button>
          </div>
        )}
      </section>

      <section aria-label="Pieces" className="mx-auto max-w-[1500px] px-4 pb-24 sm:px-8 lg:px-12">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-5 py-20">
            <p className="font-display text-[34px]">Nothing matches that yet.</p>
            <button type="button" onClick={reset} className="pill pill--ink">Show every piece</button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {filtered.map((product, i) => (
              <li key={product.id} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <ProductCard product={product} number={numbers[product.id]} priority={i < 4} highPriority={i < 2} />
              </li>
            )).flatMap((card, i) =>
              showFeature && i === 3
                ? [
                    card,
                    <li key="feature" className="rise col-span-2 lg:order-none lg:col-span-4">
                      <Link href={`/product/${feature.product.slug}`} className="card group relative grid overflow-hidden bg-ink text-white md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <span className="relative block aspect-[9/16] max-h-[640px] w-full overflow-hidden md:aspect-auto md:h-[560px]">
                          <ReelVideo code={feature.code} label={feature.alt} width={720} />
                        </span>
                        <span className="flex flex-col justify-end gap-5 p-6 sm:p-10">
                          <span className="label text-[12px] text-white/70">Film · plays as you scroll</span>
                          <span className="font-display text-[40px] leading-[1.02] sm:text-[60px]">{shortName(feature.product.productName)}, in motion.</span>
                          <span className="pill pill--light self-start">Shop {shortName(feature.product.productName)} · {formatStorePrice(feature.product.price)}</span>
                        </span>
                      </Link>
                    </li>,
                  ]
                : [card],
            )}
          </ul>
        )}
      </section>
    </>
  );
}
