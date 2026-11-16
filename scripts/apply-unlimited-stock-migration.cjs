// Adds products.unlimited_stock (on for every product) and order_items.stock_reserved.
//   node --env-file=.env scripts/apply-unlimited-stock-migration.cjs
const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const statements = fs.readFileSync("drizzle/0011_unlimited_stock.sql", "utf8").split(";").map((s) => s.replace(/^--.*$/gm, "").trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  const [{ n }] = await sql.query('select count(*)::int as n from "products" where "unlimited_stock"');
  console.log(`Done. ${n} products are set to unlimited stock.`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
