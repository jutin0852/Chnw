-- Made-to-order stock: products never sell out unless the team switches tracking on.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unlimited_stock" boolean DEFAULT true NOT NULL;
ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "stock_reserved" boolean DEFAULT true NOT NULL;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "payment_checkout_id" text;
