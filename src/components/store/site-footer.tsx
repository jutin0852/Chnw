import Link from "next/link";
import { BRAND } from "@/config/brand";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export default function SiteFooter() {
  const chatHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello CHNW, I have a question about a piece.")}` : BRAND.social.instagram;
  return (
    <footer className="bg-paper text-ink">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-14 px-4 pb-6 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex max-w-md flex-col items-start gap-5">
            <p className="font-display text-[28px] leading-[1.1] sm:text-[34px]">Questions about fit, or a piece made your way?</p>
            <a href={chatHref} target="_blank" rel="noreferrer" className="pill pill--line">
              {whatsapp ? "Chat with us on WhatsApp" : "Message us on Instagram"}
            </a>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] sm:grid-cols-3">
            <div className="flex flex-col gap-3">
              <span className="label text-stone">Shop</span>
              <Link href="/shop" className="draw w-fit">All pieces</Link>
              <Link href="/shop?category=bags" className="draw w-fit">Bags</Link>
              <Link href="/shop?category=skirts" className="draw w-fit">Skirts</Link>
              <Link href="/shop?category=dresses" className="draw w-fit">Dresses</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="label text-stone">Help</span>
              <Link href="/shipping-delivery" className="draw w-fit">Delivery</Link>
              <Link href="/returns-exchanges" className="draw w-fit">Adjustments and returns</Link>
              <Link href="/account" className="draw w-fit">Your account</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="label text-stone">CHNW</span>
              <a href={BRAND.social.instagram} target="_blank" rel="noreferrer" className="draw w-fit">Instagram</a>
              <Link href="/privacy" className="draw w-fit">Privacy</Link>
              <Link href="/terms" className="draw w-fit">Terms</Link>
            </div>
          </nav>
        </div>
        <div>
          <p
            aria-hidden="true"
            className="select-none font-display font-semibold leading-[0.78] tracking-[0.05em] text-thread"
            style={{ fontSize: "clamp(96px, 25.5vw, 400px)" }}
          >
            CHNW
          </p>
          <div className="label mt-6 flex flex-wrap justify-between gap-3 border-t border-[var(--line)] pt-4 text-[11px] text-stone">
            <span>© {new Date().getFullYear()} CHNW · Made to order in Nigeria</span>
            <span>UK sizes 4 to 20 · Adjustments within 30 days</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
