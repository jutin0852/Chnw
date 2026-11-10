-- Films shown on the storefront: the three home hero reels and one reel per product page.
CREATE TABLE IF NOT EXISTS "site_films" (
  "id" text PRIMARY KEY NOT NULL,
  "placement" text NOT NULL,
  "product_id" text REFERENCES "products"("id") ON DELETE CASCADE,
  "position" integer DEFAULT 0 NOT NULL,
  "video_id" text NOT NULL,
  "alt" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "site_films_hero_position_unique" ON "site_films" ("position") WHERE "placement" = 'hero';
CREATE UNIQUE INDEX IF NOT EXISTS "site_films_product_unique" ON "site_films" ("product_id") WHERE "placement" = 'product';
