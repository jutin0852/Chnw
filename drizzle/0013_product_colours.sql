-- Colours a customer can choose on the product page. Empty means the piece comes in one colour.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "colours" jsonb DEFAULT '[]'::jsonb;
