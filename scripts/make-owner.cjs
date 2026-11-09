// Promotes an existing account to store owner (full admin access).
// 1. Register normally on the site with the owner's email.
// 2. Run: OWNER_EMAIL=you@example.com node --env-file=.env scripts/make-owner.cjs
const { neon } = require("@neondatabase/serverless");

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) throw new Error("Set OWNER_EMAIL to the account email you want to make the owner.");
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL first.");
  const sql = neon(process.env.DATABASE_URL);
  const updated = await sql.query(
    'update "user" set "role" = \'owner\', "isAdmin" = true where lower("email") = lower($1) returning "email"',
    [ownerEmail],
  );
  if (!updated.length) throw new Error("No account with that email yet. Register on the site first, then run this again.");
  console.log(`${updated[0].email} is now the store owner.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
