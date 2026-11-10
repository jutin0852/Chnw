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

## Reference sites (collected 2026-11-10, not implemented yet)

**Balmoral — https://www.balmoralrunning.com/ — hero video**
- Full-screen video (100vh, `object-fit: cover`), autoplay, muted, loop, no controls. It's a 1080p MP4 served from the Shopify CDN.
- Footage is slow and moody with a lone figure and real locations, colour-graded down. It reads as film rather than an ad.
- A big centred white serif wordmark sits over the video, with a small version of the same wordmark in the nav.
- Bottom edge: a serif "New Arrivals" label and a small "Shop" link on the left, and a short paragraph about the season on the right.
- For CHNW: use one of the reels (a workroom, sewing or styling clip) as the home hero, with the serif CHNW wordmark over it and the season note at the bottom.

**Outfit by ++hellohello — https://outfit.hellohello.is/ — loader and motion**
- Loader on a black screen: the OUTFIT wordmark, a small rapid slideshow of product photos flickering inside the gap between letters, and a counter ("083") counting to 100.
- Then the letters collapse into bars and the screen wipes up to the light page.
- After loading, a huge full-width wordmark in the accent colour sits above a thin rule, an info row in small text and the product grid.
- The grid is uneven: cards of different sizes are scattered with lots of empty space, and each card has its name, price and a small coloured dot tag.
- Built on Next.js (our stack) with Lenis smooth scroll.
- For CHNW: the CHNW wordmark with Instagram photos flickering through it, a 0–100 counter in mono, then a red wipe revealing the home page.
  - Show it once per session.
  - Respect `prefers-reduced-motion`.

**Deadly Ponies — https://deadlyponies.com/ — typography**
- The site runs almost entirely on one custom typewriter-style monospace with slab serifs (`DLYP-SansText`, their own font), mostly in uppercase.
- It is used small and widely spaced for the nav, labels and links, with the wordmark in the same voice.
- That one-font, typewriter discipline is what makes it stand apart.
- The font is proprietary, so we can't use it.
  - Free options closest in feel: Courier Prime, Cutive Mono, Xanh Mono.
  - Paid options: Klim's Pitch, GT Alpina Typewriter.
- For CHNW: this could replace or sit beside IBM Plex Mono for the work-tag, label and nav layer, next to the Bodoni wordmark.

## Avoid

- Generic stock photography
- Unverified claims, reviews, or delivery promises
- Multiple unrelated accent colours

## Decisions

- 2026-11-09: Codebase set up from the shared store template. Placeholder denim palette and text logo until CHNW's assets arrive.
- 2026-11-09: Rebranded from Instagram research. Accent is CHNW red #A40009 (strong #7A0007, tint #F7ECEB). Bodoni Moda (Google Fonts) is the display serif for the wordmark and storefront headings; body text and the admin stay sans. Favicons and share image are a red disc / red card with the white serif wordmark. Swap in the real logo file when CHNW sends it.

## Store redesign: The Workroom (implemented 2026-11-10)

```
Idea:        The store feels like walking into CHNW's studio: real fabric, real hands, made after you order.
Metaphor:    A sewing workroom. Thread red, work tags, tacking stitches, typewritten labels.
Signature:   First-visit loader. CHNW's photos flicker through a window in the wordmark, a counter follows
             real loading, a thread-red panel wipes up and lifts off the hero films already playing.
Emotion:     Calm, crafted, confident. A studio, not a sale.
Motion verb: Settle like cloth. Long expo outs, nothing bouncy; red wipes between pages.
Screenshot:  Three reels side by side with the white Bodoni CHNW across them.
```

### System
- Palette: paper #FFFFFF (ground), ink #141210 (text, dark bands), thread red #A40009 (accent, CTAs, wipes), mist #F3F1EE (banded sections), stone #5E574F (muted text).
- Type: Bodoni Moda (display, wordmark), Instrument Sans (reading), Courier Prime (labels, prices, nav, after Deadly Ponies). All via next/font/google.
- Shape: pills for actions, square everything else. Dashed red "stitch" rule as the divider and checkout progress.
- Motion: GSAP + Lenis on one clock (`src/engine`), SplitText headline reveals, clip reveals on media, red curtain between storefront pages (`src/engine/transition.ts`). Admin, checkout and account keep native scroll and plain navigation. Everything switches off under reduced motion; hero films start paused and every film can be paused.
- Films: Instagram reels on Cloudinary (`chnw/video/<post code>`), mapped in `src/config/films.ts`. Reels play only while on screen.

### Decisions
- 2026-11-10: Reels are 720×1280, so the desktop hero shows three side by side at native sharpness instead of stretching one (after Balmoral's full-screen film, adapted). Phones show the middle reel alone.
- 2026-11-10: Page background is pure white (owner's choice over linen).
- 2026-11-10: Product size picker uses CHNW's UK 4 to 20 chart (replaces the template's S/M/L/XL table). No size is preselected.
- 2026-11-10: New `/shop` page holds the filterable grid; home is editorial. Header links use `?category=`.
