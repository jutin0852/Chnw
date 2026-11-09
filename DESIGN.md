# CHNW design direction

Shared design brief for the storefront. Edit it whenever the brand direction changes, and read it before making design changes.

## Brand

- Name: CHNW (Instagram: @chnw.ng)
- What it is: a Nigerian slow-fashion label; most pieces are reworked denim, made in small batches
- Instagram bio: "Handmade · Made to order". Sales today happen by DM.
- Positioning: considered, sustainable, one-of-a-kind — fewer, better clothes

## Research from Instagram (@chnw.ng, 2026-11-09)

Collected from the public profile (89 posts, ~1.1k followers). `chnw.ng` does not resolve yet (no DNS record), so Instagram is the only source.

### Logo and colour

- Logo: white high-contrast serif wordmark "CHNW" centred on a solid red disc, with a tiny line of text underneath (unreadable at the 150px profile size, so ask for the source file).
- Brand red sampled from the logo: **#A40009** (deep cherry red).
- Colours that recur in the products and photos: black, cherry red, chocolate brown, burgundy, white, indigo denim, black denim.
- The site's current denim-indigo palette (`#2f4a6d`) does not match the brand.

### Type and graphics

- Post graphics and the Policies / Size chart cards use an elegant, high-contrast serif in uppercase (Didone style), black on white or white on photo, sometimes inside a thin white outline box.
- Captions use a pattern: "The [Product]✨", "Introducing The [Product]", "The X x The Y", then the price on its own line as "N50,000".

### Photography

- Natural light, sheer white curtains and plain walls as backdrops, clothes-rack product shots, on-body shots of Black women, close-ups of crochet, eyelets and stitching, gold jewellery styling.

### Products and latest prices (₦, newest caption wins)

| Product | Price | Options / notes |
|---|---|---|
| The Triangle Tote (faux leather) | 50,000 | Black, brown, cherry red, burgundy. Lace-up eyelet sides |
| The Crochet Denim Skirt | 80,000 | Blue and black denim. Price rose over time: 60k → 70k → 80k |
| The Asymmetric Denim Skirt | 65,000 | Maxi, flowy |
| The Halter Tank | 17,500 | Black, burgundy |
| The Gigi Pants | 57,000 | Oversized, drawstrings at waist and hems, wear as pants or jorts |
| The Mila Set | 80,000 | Two-piece denim set |
| The Ruffle Mini Skirt | 51,000 | Bleached-pattern denim, each piece one of one |
| Open-back denim dress (name not given) | 47,000 | Pockets, ruffle hem, contrast edges |
| The Soni Dress | 39,000 | Black and tan |
| The Button-up Dress | Mini 35,000 · Midi 40,000 | Maxi offered in 2024 |
| The Clilla Set | 35,000 | Black and blue denim. Clilla top alone 20,000 |
| The Sculpt Dress | Long sleeve 35,000 · Short sleeve 30,000 | White shown |
| The Alora Halter Dress | not stated | Denim |

Older posts from 2024–early 2025, possibly discontinued: denim Grande / Jumbo Triangle Tote (35,000 / 46,000), upcycled denim crochet bags (mini 13,000, midi 15,000), corset shirt (20,000), reworked blazer dress (30,000), micro crop top, and the "Business in the front, party at the back" collection.

### Policies (from the Policies highlight)

- No refunds. CHNW offers adjustments or remakes instead.
- Items can come back for adjustment within 30 days. Sale and customised items are final.
- If a problem comes from measurements the customer gave, the customer pays delivery for the adjustment. Items must come back in good condition.
- Upcycled pieces can differ slightly from the samples shown.
- Production and delivery take 5–7 business days.

### Size chart (UK, from the Size chart highlight, inches)

| UK size | Bust | Waist | Hips |
|---|---|---|---|
| 4 | 32 | 25 | 34 |
| 6 | 33 | 27 | 36 |
| 8 | 35 | 29 | 38 |
| 10 | 37 | 30 | 40 |
| 12 | 38 | 32 | 41 |
| 14 | 40 | 33 | 43 |
| 16 | 41 | 35 | 44 |
| 18 | 44 | 37 | 47 |
| 20 | 46 | 40 | 49 |

The unit isn't printed on the chart. These numbers match inches.

### Other

- Highlights: "CHNW & …", Triangle Totes, Crochet skirt, Dresses, Policies, Size chart.
- Events: stand at Street Souk (Dec 2024). Tagged in the Saints & Friends "Pretty Girls Pop-Up" (Nov 15).
- Collab: crochet denim skirt with @qreenade (Dec 2024).

## To confirm with CHNW

- [ ] Logo files (SVG or transparent PNG) — the site currently uses a text placeholder
- [ ] Brand colours — #A40009 sampled from the logo; confirm the exact value
- [ ] Typeface name for the serif wordmark and graphics
- [ ] Product list: current prices above are from captions; confirm sizes, stock, photos, and which older pieces are still sold
- [ ] Delivery areas and costs (timing: 5–7 business days per Policies)
- [ ] Contact details for invoices: address, phone, WhatsApp, email
- [ ] Domain the store launches on (`chnw.ng` is not registered or has no DNS yet)

## Visual direction (starting point)

- Let the garments and the texture of reworked denim carry the visual interest
- Clean layouts, generous space, one accent colour
- Honest, specific copy about how pieces are made — no unverified sustainability claims

## Avoid

- Generic stock photography
- Unverified claims, reviews, or delivery promises
- Multiple unrelated accent colours

## Decisions

- 2026-11-09: Codebase set up from the shared store template. Placeholder denim palette and text logo until CHNW's assets arrive.
- 2026-11-09: Rebranded from Instagram research. Accent is CHNW red #A40009 (strong #7A0007, tint #F7ECEB). Bodoni Moda (Google Fonts) is the display serif for the wordmark and storefront headings; body text and the admin stay sans. Favicons and share image are a red disc / red card with the white serif wordmark. Swap in the real logo file when CHNW sends it.
