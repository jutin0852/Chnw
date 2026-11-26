"use client";

import Link from "next/link";
import type { StoreProduct } from "../store/cart-context";
import { ProductPhotos } from "./product-photos";

/** Every product's photos in one place: replace, reorder, remove or add without reposting. */
export function ProductMediaLibrary({ products }: { products: StoreProduct[] }) {
  const total = products.reduce((sum, product) => sum + product.images.length, 0);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total} photos across {products.length} products.
      </p>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium">
                {product.productName}
                {!product.isActive && <span className="ml-2 text-xs font-normal text-muted-foreground">(hidden from the store)</span>}
              </p>
              <Link href={`/admin/product-list/${product.id}`} className="text-xs underline">Edit product</Link>
            </div>
            <ProductPhotos
              productId={product.id}
              productName={product.productName}
              images={product.images.map((image) => ({ id: image.id, imageUrl: image.imageUrl, altText: image.altText ?? null }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
