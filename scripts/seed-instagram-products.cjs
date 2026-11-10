/**
 * Seeds CHNW's current catalogue, taken from the @chnw.ng Instagram captions (2026-11-09).
 * Products are created HIDDEN (is_active = false) so they can be reviewed in /admin before going live.
 * Stock is a placeholder (STOCK_PER_SIZE per size) — set real counts in the admin.
 * Images point at public/products/*.jpg (local dev); re-upload to Cloudinary for production.
 *
 * Safe to re-run: existing categories and products (matched by slug) are skipped.
 *
 *   node --env-file=.env scripts/seed-instagram-products.cjs
 */
const { neon } = require("@neondatabase/serverless");
const { createId } = require("@paralleldrive/cuid2");

const STOCK_PER_SIZE = 5;
const UK_SIZES = ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"];

const CATEGORIES = [
  { slug: "bags", name: "Bags" },
  { slug: "skirts", name: "Skirts" },
  { slug: "dresses", name: "Dresses" },
  { slug: "sets", name: "Sets" },
  { slug: "tops", name: "Tops" },
  { slug: "pants", name: "Pants" },
];

const PRODUCTS = [
  {
    name: "The Triangle Tote", slug: "the-triangle-tote", sku: "CHNW-TOTE", category: "bags", price: 50000, featured: true, sizes: [],
    materials: "Faux leather",
    description: "Our everyday bag: a roomy triangular tote with lace-up eyelet sides. Available in black, brown, cherry red and burgundy.",
    images: ["triangle-tote-1", "triangle-tote-3"],
  },
  {
    name: "The Crochet Denim Skirt", slug: "the-crochet-denim-skirt", sku: "CHNW-CROCHET-SKIRT", category: "skirts", price: 80000, featured: true, sizes: UK_SIZES,
    materials: "Denim, crochet",
    description: "A mini skirt in crochet-textured denim with a drawstring waist. Available in blue and black denim.",
    images: ["crochet-denim-skirt-1", "crochet-denim-skirt-2", "crochet-denim-skirt-3"],
  },
  {
    name: "The Asymmetric Denim Skirt", slug: "the-asymmetric-denim-skirt", sku: "CHNW-ASYM-SKIRT", category: "skirts", price: 65000, featured: true, sizes: UK_SIZES,
    materials: "Denim",
    description: "A flowy maxi skirt in denim with an asymmetric hem.",
    images: ["asymmetric-denim-skirt-1", "asymmetric-denim-skirt-2"],
  },
  {
    name: "The Halter Tank", slug: "the-halter-tank", sku: "CHNW-HALTER-TANK", category: "tops", price: 17500, sizes: UK_SIZES,
    description: "A fitted halter-neck tank. Shown in black and burgundy.",
    images: ["halter-tank-2", "halter-tank-1"],
  },
  {
    name: "The Gigi Pants", slug: "the-gigi-pants", sku: "CHNW-GIGI", category: "pants", price: 57000, sizes: UK_SIZES,
    description: "Structured oversized pants with adjustable drawstrings at the waist and leg hems. Cinch them for a custom fit, or wear them as pants or jorts. Shown in black and red.",
    images: ["gigi-pants-1", "gigi-pants-2"],
  },
  {
    name: "The Mila Set", slug: "the-mila-set", sku: "CHNW-MILA", category: "sets", price: 80000, sizes: UK_SIZES,
    materials: "Denim",
    description: "A two-piece denim set: a strapless top and a long skirt with a front slit.",
    images: ["mila-set-1"],
  },
  {
    name: "The Ruffle Mini Skirt", slug: "the-ruffle-mini-skirt", sku: "CHNW-RUFFLE-MINI", category: "skirts", price: 51000, sizes: UK_SIZES,
    materials: "Bleached denim",
    description: "A tiered ruffle mini skirt in denim with bleached patterns, so every piece is one of one.",
    images: ["ruffle-mini-skirt-2"],
  },
  {
    name: "The Open-Back Denim Dress", slug: "the-open-back-denim-dress", sku: "CHNW-OPEN-BACK", category: "dresses", price: 47000, sizes: UK_SIZES,
    materials: "Denim",
    description: "A denim dress with an open back, pockets, a ruffle hem and contrast edges.",
    images: ["open-back-denim-dress-2"],
  },
  {
    name: "The Soni Dress", slug: "the-soni-dress", sku: "CHNW-SONI", category: "dresses", price: 39000, sizes: UK_SIZES,
    description: "A strapless mini dress with contrast trim. Available in black and tan.",
    images: ["soni-dress-1", "soni-dress-2"],
  },
  {
    name: "The Button-up Dress (Mini)", slug: "the-button-up-dress-mini", sku: "CHNW-BUTTON-MINI", category: "dresses", price: 35000, sizes: UK_SIZES,
    materials: "Denim",
    description: "A denim halter dress with a white button-up collar, in mini length. Also available in midi.",
    images: ["button-up-dress-1", "button-up-dress-2"],
  },
  {
    name: "The Button-up Dress (Midi)", slug: "the-button-up-dress-midi", sku: "CHNW-BUTTON-MIDI", category: "dresses", price: 40000, sizes: UK_SIZES,
    materials: "Denim",
    description: "A denim halter dress with a white button-up collar, in midi length. Also available in mini.",
    images: ["button-up-dress-2", "button-up-dress-1"],
  },
  {
    name: "The Clilla Set", slug: "the-clilla-set", sku: "CHNW-CLILLA", category: "sets", price: 35000, sizes: UK_SIZES,
    materials: "Denim",
    description: "A two-piece denim set with a lace-up back. Available in black and blue denim.",
    images: ["clilla-set-1", "clilla-set-2"],
  },
  {
    name: "The Sculpt Dress", slug: "the-sculpt-dress", sku: "CHNW-SCULPT", category: "dresses", price: 35000, sizes: UK_SIZES,
    description: "A fitted long-sleeve dress with a full skirt.",
    images: ["sculpt-dress-1"],
  },
];

const skuPart = (size) => size.toUpperCase().replace(/[^A-Z0-9]+/g, "-");

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Run with --env-file=.env");
  const sql = neon(process.env.DATABASE_URL);

  for (const category of CATEGORIES) {
    await sql`insert into categories (id, name, slug) values (${createId()}, ${category.name}, ${category.slug}) on conflict (slug) do nothing`;
  }
  const categoryRows = await sql`select id, slug from categories`;
  const categoryId = Object.fromEntries(categoryRows.map((row) => [row.slug, row.id]));

  let created = 0;
  for (const product of PRODUCTS) {
    const [existing] = await sql`select id from products where slug = ${product.slug}`;
    if (existing) {
      console.log(`skip   ${product.name} (already exists)`);
      continue;
    }
    const productId = createId();
    const variantSizes = product.sizes.length ? product.sizes : ["ONE_SIZE"];
    await sql.transaction([
      sql`insert into products (id, "Product_name", slug, description, price, category_id, inventory_count, sku, is_active, featured, sizes, inventory_migration_status, materials)
          values (${productId}, ${product.name}, ${product.slug}, ${product.description}, ${product.price.toFixed(2)}, ${categoryId[product.category]},
                  ${product.sizes.length ? null : STOCK_PER_SIZE}, ${product.sku}, false, ${Boolean(product.featured)}, ${JSON.stringify(product.sizes)}::jsonb, 'migrated', ${product.materials ?? null})`,
      ...variantSizes.map((size) => sql`insert into product_variants (id, product_id, size, sku, inventory_count, is_active)
          values (${createId()}, ${productId}, ${size}, ${`${product.sku}-${skuPart(size)}`}, ${STOCK_PER_SIZE}, true)`), // sizes active; the product-level is_active flag hides it
      ...product.images.map((image, index) => sql`insert into product_images (product_id, image_url, alt_text, display_order)
          values (${productId}, ${`/products/${image}.jpg`}, ${product.name}, ${index})`),
    ]);
    created += 1;
    console.log(`create ${product.name} — ₦${product.price.toLocaleString("en-NG")}, ${variantSizes.length} size(s), ${product.images.length} photo(s)`);
  }
  console.log(`\nDone: ${created} created, ${PRODUCTS.length - created} skipped. All new products are hidden until activated in /admin.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
