// next/image loader: Cloudinary resizes and converts (AVIF/WebP via f_auto) on its CDN, so image
// work never runs on Vercel and never counts against its image-optimisation limit.
// Images that are not on Cloudinary (local brand files) are served as they are.
export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const marker = "/image/upload/";
  if (!src.includes("res.cloudinary.com") || !src.includes(marker)) return src;
  const q = quality ? `q_${quality}` : "q_auto";
  return src.replace(marker, `${marker}f_auto,${q},c_limit,w_${width}/`);
}
