# Moving CHNW to its own domain

Everything for search and sharing already reads the store's address from one setting, so the move is
mostly configuration. Do these in order on launch day.

## 1. Point the domain at Vercel
- Vercel → chnw → Settings → Domains → add the domain (for example `chnw.ng`) and `www.chnw.ng`.
- Add the DNS records Vercel shows at your domain registrar. Wait until Vercel says "Valid".

## 2. Tell the store its new address
In Vercel → Settings → Environment Variables, change:
- `NEXT_PUBLIC_APP_URL` → `https://chnw.ng`
- `BETTER_AUTH_URL` → `https://chnw.ng`

In code, `src/config/brand.ts` → `domain` must match (it is `chnw.ng` today). `www.` already
redirects to the bare domain, and once the address changes, `chnw-pi.vercel.app` forwards to the
domain automatically (payment webhooks under `/api/` keep working on the old address).

Redeploy.

## 3. Email from the domain
- Resend → Domains → add the domain, then add its DNS records at the registrar.
- Vercel: set `EMAIL_FROM` to something like `CHNW <hello@chnw.ng>`. Redeploy.
- Until this is done, emails only reach the account owner's inbox.

## 4. Payments
- Bachs → Developer Portal → Webhooks: change the endpoint to `https://chnw.ng/api/bachs/webhook`
  (the old address keeps working meanwhile).

## 5. Google and Bing
- Google Search Console → add property `https://chnw.ng` → "HTML tag" method → copy only the
  `content` code into the Vercel variable `GOOGLE_SITE_VERIFICATION`. Redeploy, then click Verify.
- Submit the sitemap: `https://chnw.ng/sitemap.xml`.
- Bing Webmaster Tools: import from Google Search Console, or put its code in
  `BING_SITE_VERIFICATION`.
- Check a product with Google's Rich Results Test: it should find Product (price, availability,
  delivery time) and Breadcrumb data.

## Already in place
- Product pages: Product + Offer + delivery-time data, breadcrumbs, price-first descriptions.
- Branded 1200×630 share cards for every product (red panel, name, price, photo), made by Cloudinary.
- Sitemap with every product, category page and image; refreshed at most hourly.
- `robots.txt` that blocks admin, account, checkout and sign-in pages, and blocks everything on
  preview deployments so test copies never appear in Google.
