import { unstable_cache } from "next/cache";
import { getAllProducts as queryAllProducts, getProductBySlug as queryProductBySlug } from "@/lib/admin/queries/product";

// Storefront reads are cached for a short time so navigating between pages renders from memory
// instead of waiting on the database every click. Admin changes show up within the revalidate window.
const REVALIDATE_SECONDS = 30;

export const getAllProducts = unstable_cache(queryAllProducts, ["store-all-products"], { revalidate: REVALIDATE_SECONDS, tags: ["products"] });
export const getProductBySlug = unstable_cache(queryProductBySlug, ["store-product-by-slug"], { revalidate: REVALIDATE_SECONDS, tags: ["products"] });
