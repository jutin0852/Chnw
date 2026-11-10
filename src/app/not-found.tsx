import Link from "next/link";
import SiteHeader from "@/components/store/site-header";
import SiteFooter from "@/components/store/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-paper text-ink outline-none">
        <section className="mx-auto flex min-h-[70vh] max-w-[1500px] flex-col justify-center gap-8 px-4 py-20 sm:px-8 lg:px-12">
          <p className="label text-[12px] text-thread">Error 404 · loose thread</p>
          <h1 className="max-w-4xl text-[52px] leading-[0.96] sm:text-[96px]">This page came off the pattern.</h1>
          <div className="stitch max-w-[420px]" />
          <p className="max-w-lg text-[17px] leading-[1.6] text-stone">The link may be old, or the piece may have sold out for good. Everything still being made is in the shop.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="pill pill--red">See every piece</Link>
            <Link href="/" className="pill pill--line">Back to the home page</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
