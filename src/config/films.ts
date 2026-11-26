/**
 * CHNW's Instagram reels, hosted on Cloudinary under chnw/video/<code>.
 * The code is the Instagram post code, so every film can be traced back to its post.
 */
const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "nwrotdpo";

/**
 * MP4 (H.264, no audio) sized for the slot, with a capped bitrate: about half the size of the plain
 * q_auto version at 720px, two thirds smaller at 540px. Cloudinary transcodes once, then serves from its CDN.
 * `sharp` is for the home hero, which fills the screen: high quality, a generous bitrate cap, and
 * never wider than the source (c_limit), so it stays crisp on large and high-density screens.
 */
export function filmSrc(code: string, width = 720, sharp = false) {
  const settings = sharp ? `q_auto:best,br_${width >= 1080 ? 6000 : 4000}k` : `br_${width <= 540 ? 900 : 1400}k`;
  return `https://res.cloudinary.com/${cloud}/video/upload/${settings},vc_h264,ac_none,w_${width},c_limit/${publicId(code)}.mp4`;
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

/**
 * "Worn by you, filmed by us" reels strip on the home page: four films, each linked to the piece it
 * shows. These are the built-in films; each slot can be replaced in /admin/films.
 */
export type ReelFilm = Film & { slug: string; label: string };
export const REEL_SLOTS = 4;
export const reelFilms: ReelFilm[] = [
  { code: "DRXMN9Rihls", slug: "the-triangle-tote", label: "The Triangle Tote", alt: "The Triangle Tote carried over the shoulder" },
  { code: "DQrg4vbimiq", slug: "the-crochet-denim-skirt", label: "The Crochet Denim Skirt", alt: "Close-up of the Crochet Denim Skirt's drawstring waist" },
  { code: "DU5M1gUCvvF", slug: "the-asymmetric-denim-skirt", label: "The Asymmetric Denim Skirt", alt: "The Asymmetric Denim Skirt moving as the model turns" },
  { code: "DTmyNfXCoST", slug: "the-gigi-pants", label: "The Gigi Pants", alt: "The Gigi Pants worn with sandals" },
];

/**
 * The only product films on the store. Each one can be replaced in /admin/films.
 * - The Crochet Denim Skirt film plays in the home page's "fabric vs what we make" section and on the skirt's page.
 * - The Gigi Pants film is the featured film on the shop page and plays on the pants' page.
 */
export const featuredFilms: { slug: string; label: string; where: string; film: Film }[] = [
  {
    slug: "the-crochet-denim-skirt",
    label: "Crochet Denim Skirt",
    where: "Home page, in the \u201cfabric vs what we make\u201d section, and on the skirt\u2019s product page.",
    film: { code: "DemXoC5K3YJ", alt: "Crochet denim fabric, then the finished Crochet Denim Skirt being worn" },
  },
  {
    slug: "the-gigi-pants",
    label: "Gigi Pants",
    where: "Shop page, as the featured film, and on the pants\u2019 product page.",
    film: { code: "DTmyNfXCoST", alt: "The Gigi Pants in motion" },
  },
];

export const FEATURED_FILM_SLUGS = featuredFilms.map((f) => f.slug);
