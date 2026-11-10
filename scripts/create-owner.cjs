// Creates the store owner account directly in the database, already verified, so you can sign in
// before email delivery (Resend) is set up. The password is read from the command line and is
// hashed with Better Auth's own hasher; it is never stored or printed in plain text.
//
//   OWNER_EMAIL=you@example.com OWNER_PASSWORD='a long password' node --env-file=.env scripts/create-owner.cjs
const { neon } = require("@neondatabase/serverless");
const { createId } = require("@paralleldrive/cuid2");

async function main() {
  const email = (process.env.OWNER_EMAIL || "").trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD || "";
  const name = process.env.OWNER_NAME || "CHNW Owner";
  if (!email) throw new Error("Set OWNER_EMAIL.");
  if (password.length < 8) throw new Error("Set OWNER_PASSWORD (at least 8 characters).");
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL (run with --env-file=.env).");

  const { hashPassword } = require("better-auth/crypto");
  const sql = neon(process.env.DATABASE_URL);
  const existing = await sql.query('select id from "user" where lower("email") = $1', [email]);
  if (existing.length) throw new Error("An account with that email already exists. Use scripts/make-owner.cjs to promote it.");

  const userId = createId();
  const hash = await hashPassword(password);
  await sql.transaction([
    sql.query(
      'insert into "user" ("id","name","email","emailVerified","isAdmin","role","createdAt","updatedAt") values ($1,$2,$3,true,true,\'owner\',now(),now())',
      [userId, name, email],
    ),
    sql.query(
      'insert into "account" ("id","userId","accountId","providerId","password","createdAt","updatedAt") values ($1,$2,$3,\'credential\',$4,now(),now())',
      [createId(), userId, userId, hash],
    ),
  ]);
  console.log(`${email} is now a verified store owner. Sign in at /login.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
