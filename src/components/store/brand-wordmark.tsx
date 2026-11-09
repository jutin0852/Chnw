import { BRAND } from "@/config/brand";

/**
 * Text wordmark used until CHNW's real logo file is added.
 * Size it with a text-* class (e.g. "text-3xl").
 */
export default function BrandWordmark({ className = "text-3xl" }: { className?: string }) {
  return (
    <span
      aria-label={BRAND.name}
      className={`inline-block select-none font-black uppercase leading-none tracking-[0.18em] ${className}`}
      style={{ color: "inherit" }}
    >
      {BRAND.name}
    </span>
  );
}
