// Creates the push_subscriptions table used for new-order alerts.
//   node --env-file=.env scripts/apply-push-subscriptions-migration.cjs
const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const statements = fs.readFileSync("drizzle/0012_push_subscriptions.sql", "utf8").split(";").map((s) => s.replace(/^--.*$/gm, "").trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  console.log("push_subscriptions is ready.");
}
main().catch((e) => { console.error(e.message); process.exit(1); });
