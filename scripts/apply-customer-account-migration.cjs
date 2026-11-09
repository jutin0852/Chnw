const fs = require("fs");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) throw new Error("Set OWNER_EMAIL to the store owner's account email, then run this script again.");
  const sql = neon(process.env.DATABASE_URL);
  const statements = fs.readFileSync("drizzle/0006_customer_accounts.sql", "utf8").split(";").map((statement) => statement.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  await sql.query('update "user" set "role" = \'owner\', "isAdmin" = true where lower("email") = lower($1)', [ownerEmail]);
  const [owner] = await sql.query('select "role" from "user" where lower("email") = lower($1)', [ownerEmail]);
  if (owner?.role !== "owner") throw new Error("Owner account was not found. Create the account, then run this script again.");
  console.log("Customer-account migration applied and owner role confirmed.");
}
main().catch((error) => { console.error(error.message); process.exit(1); });
