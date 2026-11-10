// Creates the site_films table and seeds it with the films that were hard-coded before
// (home hero + product page reels), so the admin starts with what is already live.
//   node --env-file=.env scripts/apply-site-films-migration.cjs
const fs = require("fs");
const { neon } = require("@neondatabase/serverless");
const { createId } = require("@paralleldrive/cuid2");

const HERO = [
  ["DRUZIfmii6s", "A model in the Asymmetric Denim Skirt against a grey studio wall"],
  ["DVoK_e9CuKp", "A lone figure walking down a palm-lined street in CHNW"],
  ["DO78CXeikoS", "A model posing against a grey wall in a CHNW piece"],
];
const PRODUCT = {
  "the-triangle-tote": ["DRXMN9Rihls", "The Triangle Tote on the move"],
  "the-crochet-denim-skirt": ["DemXoC5K3YJ", "From crochet denim fabric to the finished skirt"],
  "the-asymmetric-denim-skirt": ["DU5M1gUCvvF", "The Asymmetric Denim Skirt in motion"],
  "the-gigi-pants": ["DTmyNfXCoST", "The Gigi Pants in motion"],
};

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const statements = fs.readFileSync("drizzle/0010_site_films.sql", "utf8").split(";").map((s) => s.replace(/^--.*$/gm, "").trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);

  const [{ n }] = await sql.query('select count(*)::int as n from "site_films"');
  if (n > 0) return console.log(`site_films already has ${n} rows; nothing seeded.`);
  for (const [i, [code, alt]] of HERO.entries()) {
    await sql.query('insert into "site_films" ("id","placement","position","video_id","alt") values ($1,\'hero\',$2,$3,$4)', [createId(), i, `chnw/video/${code}`, alt]);
  }
  for (const [slug, [code, alt]] of Object.entries(PRODUCT)) {
    const [p] = await sql.query('select id from "products" where slug = $1', [slug]);
    if (!p) continue;
    await sql.query('insert into "site_films" ("id","placement","product_id","position","video_id","alt") values ($1,\'product\',$2,0,$3,$4)', [createId(), p.id, `chnw/video/${code}`, alt]);
  }
  console.log("site_films created and seeded.");
}
main().catch((e) => { console.error(e.message); process.exit(1); });
