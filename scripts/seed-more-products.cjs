/**
 * Second catalogue pass (2026-11-10): colourways, the denim tote, crochet bags, corset shirt, and
 * extra photos for existing pieces. Uploads staged images from .shots/stage to Cloudinary
 * (chnw/products/<name>) and writes products straight to the live (active) catalogue.
 *
 * Safe to re-run: new products are matched by slug and skipped; image sets are replaced only for
 * slugs listed in UPDATES, and uploads overwrite by public id.
 *
 *   node --env-file=.env scripts/seed-more-products.cjs
 */
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
const { createId } = require("@paralleldrive/cuid2");
const { v2: cloudinary } = require("cloudinary");

const STOCK_PER_SIZE = 5;
const UK_SIZES = ["UK 4", "UK 6", "UK 8", "UK 10", "UK 12", "UK 14", "UK 16", "UK 18", "UK 20"];
const STAGE = path.join(__dirname, "..", ".shots", "stage");

// image ref: "name" = a staged upload, [slug, i] = the i-th existing image of that product
const s = (n) => n;
const keep = (slug, i) => [slug, i];

const UPDATES = [
  { slug: "the-triangle-tote", name: "The Triangle Tote, Black", description: "Our everyday bag in black faux leather: a roomy triangular tote with lace-up eyelet sides. Also in brown and cherry red.", images: [s("tote-black-1"), s("tote-black-2"), s("tote-black-3"), s("tote-colours")] },
  { slug: "the-crochet-denim-skirt", name: "The Crochet Denim Skirt, Black", description: "A mini skirt in crochet-textured denim with a drawstring waist, in black. Also in blue.", images: [keep("the-crochet-denim-skirt", 0), keep("the-crochet-denim-skirt", 2), s("crochet-black-4")] },
  { slug: "the-halter-tank", name: "The Halter Tank, Black", description: "A fitted halter-neck tank with beaded ties, in black. Also in burgundy.", images: [s("halter-black-1"), s("halter-black-2"), keep("the-halter-tank", 1), s("halter-black-3")] },
  { slug: "the-soni-dress", name: "The Soni Dress, Black", description: "A strapless mini dress with contrast trim, in black. Also in tan.", images: [keep("the-soni-dress", 0), s("soni-black-3"), s("soni-black-4"), keep("the-soni-dress", 1)] },
  { slug: "the-open-back-denim-dress", images: [keep("the-open-back-denim-dress", 0), s("open-back-3"), s("open-back-4"), s("open-back-5"), s("open-back-6")] },
  { slug: "the-clilla-set", name: "The Clilla Set, Blue", description: "A two-piece denim set with a lace-up back, in blue denim. Also in black.", images: [keep("the-clilla-set", 0), keep("the-clilla-set", 1)] },
  { slug: "the-mila-set", images: [s("mila-2"), s("mila-3"), keep("the-mila-set", 0)] },
];

const PRODUCTS = [
  {
    name: "The Triangle Tote, Brown", slug: "the-triangle-tote-brown", sku: "CHNW-TOTE-BROWN", category: "bags", price: 50000, sizes: [], materials: "Faux leather",
    description: "Our everyday bag in chocolate brown faux leather: a roomy triangular tote with lace-up eyelet sides. Also in black and cherry red.",
    images: [s("tote-brown-1"), s("tote-brown-2"), s("tote-brown-3"), s("tote-colours")],
  },
  {
    name: "The Triangle Tote, Cherry Red", slug: "the-triangle-tote-cherry-red", sku: "CHNW-TOTE-RED", category: "bags", price: 50000, sizes: [], materials: "Faux leather",
    description: "Our everyday bag in cherry red faux leather: a roomy triangular tote with lace-up eyelet sides. Also in black and brown.",
    images: [s("tote-cherry-1"), s("tote-cherry-2"), keep("the-triangle-tote", 1), s("tote-colours")],
  },
  {
    name: "The Crochet Denim Skirt, Blue", slug: "the-crochet-denim-skirt-blue", sku: "CHNW-CROCHET-SKIRT-BLUE", category: "skirts", price: 80000, sizes: UK_SIZES, materials: "Denim, crochet",
    description: "A mini skirt in crochet-textured denim with a drawstring waist, in blue. Also in black.",
    images: [s("crochet-blue-1"), s("crochet-blue-2"), keep("the-crochet-denim-skirt", 1), s("crochet-blue-3")],
  },
  {
    name: "The Gigi Pants, Polka Dot", slug: "the-gigi-pants-polka-dot", sku: "CHNW-GIGI-POLKA", category: "pants", price: 57000, sizes: UK_SIZES,
    description: "Structured oversized pants in a polka dot print, with adjustable drawstrings at the waist and leg hems. Cinch them for a custom fit, or wear them as pants or jorts.",
    images: [s("gigi-polka-1"), s("gigi-polka-2"), s("gigi-polka-3"), s("gigi-polka-4")],
  },
  {
    name: "The Halter Tank, Burgundy", slug: "the-halter-tank-burgundy", sku: "CHNW-HALTER-TANK-BURGUNDY", category: "tops", price: 17500, sizes: UK_SIZES,
    description: "A fitted halter-neck tank with beaded ties, in burgundy. Also in black.",
    images: [s("halter-burgundy-1"), keep("the-halter-tank", 0), s("halter-burgundy-2")],
  },
  {
    name: "The Soni Dress, Tan", slug: "the-soni-dress-tan", sku: "CHNW-SONI-TAN", category: "dresses", price: 39000, sizes: UK_SIZES,
    description: "A strapless mini dress with contrast trim, in tan. Also in black.",
    images: [s("soni-tan-1"), s("soni-tan-2")],
  },
  {
    name: "The Clilla Set, Black", slug: "the-clilla-set-black", sku: "CHNW-CLILLA-BLACK", category: "sets", price: 35000, sizes: UK_SIZES, materials: "Denim",
    description: "A two-piece denim set: a halter top with a lace-up back and a mini skirt with a raw hem, in black denim. Also in blue.",
    images: [s("clilla-black-1"), s("clilla-black-2"), s("clilla-black-3"), s("clilla-black-4")],
  },
  {
    name: "The Denim Triangle Tote, Grande", slug: "the-denim-triangle-tote-grande", sku: "CHNW-DENIM-TOTE-GRANDE", category: "bags", price: 35000, sizes: [], materials: "Denim",
    description: "The triangle tote in printed denim, Grande size: the one for everyday, roomy enough for a wallet, phone, makeup and a little more. Also in Jumbo.",
    images: [s("dtote-1"), s("dtote-2"), s("dtote-4"), s("dtote-3"), s("dtote-5"), s("dtote-6")],
  },
  {
    name: "The Denim Triangle Tote, Jumbo", slug: "the-denim-triangle-tote-jumbo", sku: "CHNW-DENIM-TOTE-JUMBO", category: "bags", price: 46000, sizes: [], materials: "Denim",
    description: "The triangle tote in printed denim, Jumbo size: made for groceries, gym clothes or a weekend's worth of packing. Also in Grande.",
    images: [s("dtote-3"), s("dtote-4"), s("dtote-1"), s("dtote-2"), s("dtote-5"), s("dtote-6")],
  },
  {
    name: "The Upcycled Denim Crochet Bag, Mini", slug: "the-upcycled-denim-crochet-bag-mini", sku: "CHNW-CROCHET-BAG-MINI", category: "bags", price: 13000, sizes: [], materials: "Upcycled denim",
    description: "A small crochet bag worked from upcycled denim, with a detachable strap. Each one is a little different. Also in Midi.",
    images: [s("cbag-1"), s("cbag-2"), s("cbag-3")],
  },
  {
    name: "The Upcycled Denim Crochet Bag, Midi", slug: "the-upcycled-denim-crochet-bag-midi", sku: "CHNW-CROCHET-BAG-MIDI", category: "bags", price: 15000, sizes: [], materials: "Upcycled denim",
    description: "A mid-size crochet bag worked from upcycled denim, with a detachable strap. Each one is a little different. Also in Mini.",
    images: [s("cbag-2"), s("cbag-1"), s("cbag-3")],
  },
  {
    name: "The Corset Shirt", slug: "the-corset-shirt", sku: "CHNW-CORSET-SHIRT", category: "tops", price: 20000, sizes: UK_SIZES, materials: "Cotton shirting, upcycled denim",
    description: "A white shirt reworked with a light-wash denim corset panel. Made from upcycled materials, from the Business in the front, party at the back collection.",
    images: [s("corset-1"), s("corset-2"), s("corset-3")],
  },
];

const skuPart = (size) => size.toUpperCase().replace(/[^A-Z0-9]+/g, "-");

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set. Run with --env-file=.env");
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const sql = neon(process.env.DATABASE_URL);

  // 1. Existing image URLs, read before anything is replaced.
  const existing = {};
  for (const row of await sql`select p.slug, i.image_url from product_images i join products p on p.id = i.product_id order by p.slug, i.display_order`) {
    (existing[row.slug] ||= []).push(row.image_url);
  }

  // 2. Upload every staged image that is referenced.
  const names = new Set([...UPDATES, ...PRODUCTS].flatMap((p) => p.images.filter((i) => typeof i === "string")));
  const urls = {};
  for (const name of names) {
    const file = path.join(STAGE, `${name}.jpg`);
    if (!fs.existsSync(file)) throw new Error(`Missing staged image: ${file}`);
    const res = await cloudinary.uploader.upload(file, { public_id: `chnw/products/${name}`, overwrite: true, resource_type: "image" });
    urls[name] = res.secure_url;
    console.log("upload", name);
  }
  const resolve = (ref) => (typeof ref === "string" ? urls[ref] : existing[ref[0]][ref[1]]);

  const categoryRows = await sql`select id, slug from categories`;
  const categoryId = Object.fromEntries(categoryRows.map((r) => [r.slug, r.id]));

  // 3. Updates to existing products.
  for (const u of UPDATES) {
    const [row] = await sql`select id, "Product_name" as name from products where slug = ${u.slug}`;
    if (!row) { console.log(`skip update ${u.slug} (not found)`); continue; }
    const images = u.images.map(resolve);
    await sql.transaction([
      ...(u.name ? [sql`update products set "Product_name" = ${u.name}, description = ${u.description} where id = ${row.id}`] : []),
      sql`delete from product_images where product_id = ${row.id}`,
      ...images.map((url, i) => sql`insert into product_images (product_id, image_url, alt_text, display_order) values (${row.id}, ${url}, ${u.name || row.name}, ${i})`),
    ]);
    console.log(`update ${u.slug}: ${images.length} photos${u.name ? `, renamed "${u.name}"` : ""}`);
  }

  // 4. New products.
  let created = 0;
  for (const product of PRODUCTS) {
    const [found] = await sql`select id from products where slug = ${product.slug}`;
    if (found) { console.log(`skip   ${product.name} (already exists)`); continue; }
    const id = createId();
    const variantSizes = product.sizes.length ? product.sizes : ["ONE_SIZE"];
    const images = product.images.map(resolve);
    await sql.transaction([
      sql`insert into products (id, "Product_name", slug, description, price, category_id, inventory_count, sku, is_active, featured, sizes, inventory_migration_status, materials)
          values (${id}, ${product.name}, ${product.slug}, ${product.description}, ${product.price.toFixed(2)}, ${categoryId[product.category]},
                  ${product.sizes.length ? null : STOCK_PER_SIZE}, ${product.sku}, true, false, ${JSON.stringify(product.sizes)}::jsonb, 'migrated', ${product.materials ?? null})`,
      ...variantSizes.map((size) => sql`insert into product_variants (id, product_id, size, sku, inventory_count, is_active)
          values (${createId()}, ${id}, ${size}, ${`${product.sku}-${skuPart(size)}`}, ${STOCK_PER_SIZE}, true)`),
      ...images.map((url, i) => sql`insert into product_images (product_id, image_url, alt_text, display_order) values (${id}, ${url}, ${product.name}, ${i})`),
    ]);
    created += 1;
    console.log(`create ${product.name}: N${product.price.toLocaleString("en-NG")}, ${variantSizes.length} size(s), ${images.length} photo(s)`);
  }
  console.log(`\nDone: ${created} created, ${UPDATES.length} updated. Stock is a placeholder (${STOCK_PER_SIZE} per size): set real counts in /admin.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
