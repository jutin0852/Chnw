import { BRAND } from "@/config/brand";

/**
 * Placeholder CHNW logo: an SVG wordmark that scales to the width set by
 * `className` (callers pass width classes like "h-auto w-36 sm:w-44").
 *
 * When CHNW's real logo is ready, drop it into public/brand/ and swap this
 * for a next/image <Image src="/brand/chnw-logo.png" ... />.
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
        x="157"
        y="58"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight={900}
        fontSize="60"
        letterSpacing="14"
        fill="currentColor"
      >
        {BRAND.name}
      </text>
    </svg>
  );
}
