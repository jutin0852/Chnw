import { notFound } from "next/navigation";
import { requireAdmin } from "../../../../lib/admin-auth";
import { getAdminProductById } from "../../../../lib/admin/queries/product";
import { ProductEditForm } from "../../../../components/admin/product-edit-form";
import { ProductPhotos } from "../../../../components/admin/product-photos";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const product = await getAdminProductById((await params).id);
  if (!product) notFound();
  return (
    <section className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div>
        <h1 className="text-xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground">
          Update photos, product details, availability and merchandising.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold">Photos</h2>
        <p className="mb-4 text-sm text-muted-foreground">Replace any photo without reposting the product. Changes save straight away.</p>
        <ProductPhotos productId={product.id} productName={product.productName} images={product.images.map(({ id, imageUrl, altText }) => ({ id, imageUrl, altText }))} />
      </div>
      <ProductEditForm product={product} />
    </section>
  );
}
