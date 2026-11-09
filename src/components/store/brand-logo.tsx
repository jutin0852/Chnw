import { BRAND } from "@/config/brand";

/**
 * CHNW wordmark: the serif "CHNW" from the @chnw.ng logo, drawn as SVG text in the
 * display serif (Bodoni Moda, loaded in app/layout.tsx). Scales to the width set by
 * `className` (callers pass width classes like "h-auto w-36 sm:w-44").
 *
 * When CHNW's real logo file is ready, drop it into public/brand/ and swap this
 * for a next/image <Image src="/brand/chnw-logo.svg" ... />.
 */
export default function BrandLogo({
  className = "h-auto w-40 sm:w-48",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 300 80"
      role="img"
      aria-label={BRAND.name}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="153"
        y="57"
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-display), Georgia, "Times New Roman", serif' }}
        fontWeight={600}
        fontSize="58"
        letterSpacing="8"
        fill="currentColor"
      >
        {BRAND.name}
      </text>
    </svg>
  );
}
