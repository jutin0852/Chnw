# CHNW store

Next.js e-commerce site for **CHNW** — storefront, cart, Paystack checkout, customer accounts, and an admin for products, stock, orders, customers, staff and invoices/receipts.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Drizzle ORM on Neon Postgres · better-auth · Paystack · Cloudinary · Resend

## Get it running

```bash
npm install
cp .env.example .env        # fill in the values
npx drizzle-kit push        # creates all tables from src/lib/schema.ts
npm run dev
```

Then make yourself the owner:

1. Register on the site at `/account/register`.
2. `OWNER_EMAIL=you@example.com node --env-file=.env scripts/make-owner.cjs`
3. Sign in at `/login` and open `/admin`. Add categories, then products (with photos) from the admin.

There are no products in the code. The catalogue lives in the database and is managed from the admin.

## Where to customise the brand

| What | Where |
|---|---|
| Name, tagline, description, domain, Instagram/socials, invoice address & phone | `src/config/brand.ts` |
| Brand colours (whole store + admin) | `--brand*` tokens at the top of `:root` in `src/app/globals.css` (mirror them in `brand.ts` → `colors` for emails/invoices) |
| Logo | `src/components/store/brand-logo.tsx` (currently a text placeholder) |
| Favicon / app icon / share image | `public/favicon.svg`, `src/app/icon.svg`, `public/brand/` |
| Home page copy | `src/components/store/storefront.tsx` |
| Product page copy | `src/components/store/product-detail.tsx` |
| Policy pages | `src/app/shipping-delivery`, `returns-exchanges`, `privacy`, `terms` |
| Made-to-order category slug | `MADE_TO_ORDER_CATEGORY_SLUG` in `src/config/brand.ts` |
| Design brief | `DESIGN.md` |

## Scripts

- `npm run dev` / `build` / `start`
- `npm run typecheck`, `npm run lint`, `npm test`

## Deploy

Vercel. Add every variable from `.env.example` to the project, set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to the live URL, and set the Paystack webhook (see `PAYMENT-SETUP.md`). `vercel.json` schedules a daily job that releases expired checkout stock reservations.
