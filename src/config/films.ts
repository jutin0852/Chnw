/**
 * CHNW's Instagram reels, hosted on Cloudinary under chnw/video/<code>.
 * The code is the Instagram post code, so every film can be traced back to its post.
 */
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "nwrotdpo";

/**
 * MP4 (H.264, no audio) sized for the slot, with a capped bitrate: about half the size of the plain
 * q_auto version at 720px, two thirds smaller at 540px. Cloudinary transcodes once, then serves from its CDN.
 */
export function filmSrc(code: string, width = 720) {
  return `https://res.cloudinary.com/${cloud}/video/upload/br_${width <= 540 ? 900 : 1400}k,vc_h264,ac_none,w_${width},c_limit/${publicId(code)}.mp4`;
}

/** A film is either an Instagram post code (older films) or a full Cloudinary public id (uploaded in the admin). */
const publicId = (code: string) => (code.includes("/") ? code : `chnw/video/${code}`);

/** A still from the film, used as the poster so something shows before the video plays. */
export function filmPoster(code: string, width = 720, second = 0.5) {
  return `https://res.cloudinary.com/${cloud}/video/upload/so_${second},q_auto,f_jpg,w_${width},c_limit/${publicId(code)}.jpg`;
}

export type Film = { code: string; alt: string };

/** Home hero: three reels side by side on desktop, the middle one alone on phones. */
export const heroFilms: Film[] = [
  { code: "DRUZIfmii6s", alt: "A model in the Asymmetric Denim Skirt against a grey studio wall" },
  { code: "DVoK_e9CuKp", alt: "A lone figure walking down a palm-lined street in CHNW" },
  { code: "DO78CXeikoS", alt: "A model posing against a grey wall in a CHNW piece" },
];

/** "The fabric vs what we make" reel. */
export const fabricFilm: Film = { code: "DemXoC5K3YJ", alt: "Crochet denim fabric, then the finished Crochet Denim Skirt being worn" };

/** Reels strip on the home page, each tied to the piece it shows. */
export const lookFilms: (Film & { slug: string; label: string })[] = [
  { code: "DRXMN9Rihls", slug: "the-triangle-tote", label: "The Triangle Tote", alt: "The Triangle Tote carried over the shoulder" },
  { code: "DQrg4vbimiq", slug: "the-crochet-denim-skirt", label: "The Crochet Denim Skirt", alt: "Close-up of the Crochet Denim Skirt's drawstring waist" },
  { code: "DU5M1gUCvvF", slug: "the-asymmetric-denim-skirt", label: "The Asymmetric Denim Skirt", alt: "The Asymmetric Denim Skirt moving as the model turns" },
  { code: "DTmyNfXCoST", slug: "the-gigi-pants", label: "The Gigi Pants", alt: "The Gigi Pants worn with sandals" },
];

/** Product page: the reel that shows each piece in motion, placed second in the gallery. */
export const productFilm: Record<string, Film> = {
  "the-triangle-tote": { code: "DRXMN9Rihls", alt: "The Triangle Tote on the move" },
  "the-crochet-denim-skirt": { code: "DemXoC5K3YJ", alt: "From crochet denim fabric to the finished skirt" },
  "the-asymmetric-denim-skirt": { code: "DU5M1gUCvvF", alt: "The Asymmetric Denim Skirt in motion" },
  "the-gigi-pants": { code: "DTmyNfXCoST", alt: "The Gigi Pants in motion" },
};
