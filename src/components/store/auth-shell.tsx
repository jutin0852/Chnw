import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "red" | "ink" | "mist";

const tones: Record<Tone, string> = {
  red: "bg-thread text-white",
  ink: "bg-ink text-paper",
  mist: "bg-mist text-ink",
};

/**
 * Shared frame for sign in, register, recovery and access pages: a coloured side panel with the
 * wordmark and a Bodoni headline, and the form on white. Matches the storefront (Bodoni, Courier
 * labels, pills) instead of the old boxed template look.
 */
export default function AuthShell({
  tone = "red",
  panelLabel,
  panelTitle,
  panelBody,
  label,
  heading,
  children,
}: {
  tone?: Tone;
  panelLabel: string;
  panelTitle: string;
  panelBody?: string;
  label: string;
  heading: string;
  children: ReactNode;
}) {
  const quiet = tone === "mist";
  return (
    <div className="grid min-h-screen bg-paper text-ink lg:grid-cols-[5fr_7fr]">
      <aside className={`flex flex-col justify-between gap-16 px-6 py-6 sm:px-10 sm:py-8 lg:px-14 lg:py-10 ${tones[tone]}`}>
        <div className="flex items-center justify-between gap-4">
          <Link href="/" aria-label="CHNW home" className="font-display text-[26px] font-semibold tracking-[0.16em] transition-[letter-spacing] duration-700 ease-cloth hover:tracking-[0.24em]">
            CHNW
          </Link>
          <Link href="/" className="label draw py-1 text-[12px]">Back to store</Link>
        </div>
        <div className="flex max-w-[460px] flex-col gap-5">
          <p className={`label text-[12px] ${quiet ? "text-thread" : "opacity-80"}`}>{panelLabel}</p>
          <h1 className="text-[44px] leading-[0.98] sm:text-[60px]">{panelTitle}</h1>
          {panelBody && <p className={`max-w-[380px] text-[16px] leading-[1.6] ${quiet ? "text-[#3d3832]" : "opacity-85"}`}>{panelBody}</p>}
        </div>
        <div className="stitch hidden max-w-[240px] lg:block" aria-hidden="true" />
      </aside>
      <main id="main" className="flex items-center px-6 py-14 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <p className="label text-[12px] text-thread">{label}</p>
          <h2 className="mt-3 font-display text-[40px] leading-[1.02] sm:text-[46px]">{heading}</h2>
          {children}
        </div>
      </main>
    </div>
  );
}
