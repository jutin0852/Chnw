// Adds products.colours. Safe to run any number of times (ADD COLUMN IF NOT EXISTS).
// Runs automatically before every build (see "build" in package.json), so the column exists
// before code that reads it goes live. Can also be run by hand:
//   node --env-file=.env scripts/apply-product-colours-migration.cjs
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

async function main() {
  if (!process.env.DATABASE_URL) {
    // On Vercel a missing database URL must stop the deploy (the live site stays as it is);
    // a local build without a database just skips this step.
    if (process.env.VERCEL) throw new Error("DATABASE_URL is not set for this build, so the products.colours column could not be checked.");
    console.log("Skipping the product colours migration: DATABASE_URL is not set.");
    return;
  }
  const sql = neon(process.env.DATABASE_URL);
  const file = path.join(__dirname, "..", "drizzle", "0013_product_colours.sql");
  const statements = fs.readFileSync(file, "utf8").split(";").map((s) => s.replace(/^--.*$/gm, "").trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  console.log("Product colours column is ready.");
}
main().catch((e) => { console.error(e.message); process.exit(1); });
