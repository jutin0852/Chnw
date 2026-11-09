import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import BrandLogo from "../../components/store/brand-logo";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-5 text-[#111111] sm:px-10">
      <div className="mx-auto flex min-h-[calc(100dvh-40px)] max-w-[960px] flex-col border border-black">
        <header className="flex items-center justify-between border-b border-black px-5 py-4 sm:px-8">
          <Link href="/" aria-label="CHNW home"><BrandLogo className="h-auto w-36 sm:w-44" /></Link>
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">Private area</span>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-[var(--brand-tint)] text-[var(--brand)]"><LockKeyhole size={25} strokeWidth={1.5} /></div>
          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Access restricted</p>
          <h1 className="mt-4 max-w-lg text-5xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-6xl">This area is for the CHNW team.</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/65">You do not have permission to view the administration area. Sign in with an approved account or return to the store.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center gap-3 bg-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[var(--brand)]"><ArrowLeft size={16} strokeWidth={1.5} /> Return to store</Link>
            <Link href="/login" className="border border-black px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]">Sign in</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
