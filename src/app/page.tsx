import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "../lib/store-queries";
import { collapseColourways } from "@/config/colourways";
import SiteHeader from "../components/store/site-header";
import SiteFooter from "../components/store/site-footer";
import HomeLoader from "../components/store/home-loader";
import HeroFilms from "../components/store/hero-films";
import ReelVideo from "../components/store/reel-video";
import ProductCard from "../components/store/product-card";
import { cloudinaryThumb, pieceNumbers, shortName } from "../components/store/catalog";
import { formatStorePrice } from "../components/store/currency";
import { fabricFilm, heroFilms, lookFilms } from "@/config/films";

export const dynamic = "force-dynamic";

const NEW_IN = ["the-triangle-tote", "the-crochet-denim-skirt", "the-gigi-pants-polka-dot", "the-soni-dress", "the-asymmetric-denim-skirt"];

export default async function Home() {
  const everything = await getAllProducts();
  const numbers = pieceNumbers(everything);
  const bySlug = new Map(everything.map((p) => [p.slug, p]));
  const products = collapseColourways(everything);

  const picked = NEW_IN.map((slug) => bySlug.get(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const newIn = picked.length >= 5 ? picked : [...picked, ...products.filter((p) => !picked.includes(p))].slice(0, 5);

  const crochet = bySlug.get("the-crochet-denim-skirt");
  const loaderPhotos = products.flatMap((p) => p.images.slice(0, 1).map((i) => cloudinaryThumb(i.imageUrl, 260)));

  return (
    <>
      <HomeLoader photos={loaderPhotos} />
      <div className="relative">
        <SiteHeader overlay />
        <main id="main" tabIndex={-1} className="bg-paper text-ink outline-none">
          {/* ── Hero: the films ───────────────────────────── */}
          <section aria-label="Films from the workroom" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-white">
            <HeroFilms films={heroFilms} />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,0.55)_0%,rgba(20,18,16,0)_24%,rgba(20,18,16,0)_58%,rgba(20,18,16,0.7)_100%)]" />
            <h1
              data-split="chars"
              data-intro
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display !font-semibold leading-none !tracking-[0.08em]"
              style={{ fontSize: "clamp(92px, 19vw, 300px)" }}
            >
              CHNW
            </h1>
            <div
              data-reveal="fade"
              data-intro
              data-delay="0.5"
              className="absolute inset-x-4 bottom-6 flex flex-col gap-5 sm:inset-x-6 lg:inset-x-10 lg:bottom-9 lg:flex-row lg:items-end lg:justify-between"
            >
              <p className="max-w-[340px] text-[15px] leading-[1.55] text-white/90 lg:order-2 lg:mr-40">
                Reworked denim and faux leather, cut and finished by hand after you order. Made once, made to last.
              </p>
              <div className="flex items-baseline justify-between gap-5 border-t border-white/30 pt-4 lg:border-0 lg:pt-0">
                <span className="font-display text-[38px] leading-none sm:text-[52px]">New in</span>
                <Link href="/shop" className="label draw py-1 text-[12px] sm:text-[13px]">Shop new pieces</Link>
              </div>
            </div>
          </section>

          {/* ── New in: editorial grid ─────────────────────── */}
          <section aria-labelledby="new-title" className="mx-auto max-w-[1500px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--line)] pb-5">
              <h2 id="new-title" data-split="lines" className="font-display text-[40px] leading-none sm:text-[56px]">New in the workroom</h2>
              <Link href="/shop" className="label draw py-1 text-[13px]">All {products.length} pieces</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
              {newIn.map((product, i) => (
                <div key={product.id} data-reveal="up" data-delay={String((i % 3) * 0.06)} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
                  <ProductCard
                    product={product}
                    number={numbers.get(product.id)}
                    large={i === 0}
                    priority={i === 0}
                    highPriority={i === 0}
                    sizes={i === 0 ? "(max-width: 1023px) 100vw, 50vw" : "(max-width: 1023px) 50vw, 25vw"}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── The fabric vs what we make ─────────────────── */}
          <section aria-labelledby="fabric-title" className="bg-mist">
            <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-12 lg:py-28">
              <div className="flex flex-col items-start gap-6">
                <p className="label text-[12px] text-thread">The fabric vs what we make</p>
                <h2 id="fabric-title" data-split="lines" className="font-display text-[42px] leading-[1.02] sm:text-[60px]">
                  From a bolt of crochet denim to the skirt you wear.
                </h2>
                <p className="max-w-[440px] text-[17px] leading-[1.6] text-[#3d3832]">
                  Each skirt is cut and crocheted once you order it, so no two come out quite the same. Watch one come together, then choose your UK size.
                </p>
                {crochet && (
                  <Link href={`/product/${crochet.slug}`} className="pill pill--ink">
                    Shop the skirt · {formatStorePrice(crochet.price)}
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <figure className="relative aspect-[9/16] overflow-hidden bg-ink" data-reveal="clip">
                  <ReelVideo code={fabricFilm.code} label={fabricFilm.alt} />
                  <figcaption className="label absolute left-3 top-3 bg-paper px-2.5 py-1.5 text-[11px]">Film</figcaption>
                </figure>
                {crochet?.images[0] && (
                  <figure className="relative mt-16 aspect-[9/16] overflow-hidden bg-paper sm:mt-24" data-reveal="clip" data-delay="0.12">
                    <Image src={crochet.images[0].imageUrl} alt={crochet.images[0].altText || "The finished Crochet Denim Skirt"} fill sizes="(max-width: 1023px) 50vw, 30vw" className="object-cover" />
                    <figcaption className="label absolute left-3 top-3 bg-thread px-2.5 py-1.5 text-[11px] text-white">Finished</figcaption>
                  </figure>
                )}
              </div>
            </div>
          </section>

          {/* ── Reels: worn by you ─────────────────────────── */}
          <section aria-labelledby="reels-title" className="py-20 lg:py-28">
            <div className="mx-auto mb-8 flex max-w-[1500px] flex-wrap items-baseline justify-between gap-4 px-4 sm:px-8 lg:px-12">
              <h2 id="reels-title" data-split="lines" className="font-display text-[40px] leading-none sm:text-[56px]">Worn by you, filmed by us</h2>
              <a href="https://www.instagram.com/chnw.ng/" target="_blank" rel="noreferrer" className="label draw py-1 text-[13px]">@chnw.ng on Instagram</a>
            </div>
            <ul className="mx-auto flex max-w-[1500px] snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:px-8 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-12 [&::-webkit-scrollbar]:hidden">
              {lookFilms.map((film, i) => {
                const product = bySlug.get(film.slug);
                return (
                  <li key={film.code} className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto" data-reveal="up" data-delay={String(i * 0.06)}>
                    <Link href={product ? `/product/${film.slug}` : "/shop"} className="card group relative block aspect-[9/16] overflow-hidden bg-ink text-white">
                      <ReelVideo code={film.code} label={film.alt} className="transition-transform duration-[1.2s] ease-cloth group-hover:scale-[1.03]" />
                      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-[linear-gradient(180deg,rgba(20,18,16,0)_0%,rgba(20,18,16,0.78)_100%)] p-4 pt-16">
                        <span className="label text-[11px] text-white/75">Shop the look</span>
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-[22px] leading-tight">{shortName(film.label)}</span>
                          {product && <span className="label text-[12px] tracking-[0.04em]">{formatStorePrice(product.price)}</span>}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* ── The Workroom ───────────────────────────────── */}
          <section id="workroom" aria-labelledby="workroom-title" className="bg-ink text-paper">
            <div className="mx-auto grid max-w-[1500px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-32">
              <div className="flex flex-col gap-7">
                <p className="label text-[12px] text-[#e8a3a6]">The workroom</p>
                <h2 id="workroom-title" data-split="lines" className="font-display text-[46px] leading-[0.98] sm:text-[72px]">
                  Nothing waits on a shelf. We start when you order.
                </h2>
                <div className="stitch max-w-[420px]" />
              </div>
              <ol className="flex flex-col">
                {[
                  ["You order in your UK size.", "Our chart runs from UK 4 to 20, with bust, waist and hip measurements for each size."],
                  ["We cut and make it by hand.", "Production and delivery take 5 to 7 business days. Upcycled pieces can differ slightly from the photos."],
                  ["Not quite right? We adjust it.", "Send it back within 30 days for an adjustment or a remake. We do adjustments instead of refunds."],
                ].map(([title, body], i) => (
                  <li key={title} data-reveal="up" data-delay={String(i * 0.08)} className="grid grid-cols-[48px_1fr] gap-4 border-b border-white/15 py-7 first:pt-0">
                    <span className="label pt-1 text-[13px] text-[#e8a3a6]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex flex-col gap-2">
                      <strong className="font-display text-[26px] font-medium leading-tight">{title}</strong>
                      <span className="text-[16px] leading-[1.6] text-white/75">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
