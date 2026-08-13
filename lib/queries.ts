import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product, Review } from "@/types/database";

/** Product select with its category joined. */
const PRODUCT_COLUMNS = "*, category:categories(*)";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) console.error("getCategories:", error.message);
  return data ?? [];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data as Product[] | null) ?? [];
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("best_seller", true)
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data as Product[] | null) ?? [];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("new_arrival", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Product[] | null) ?? [];
}

/** Approved reviews with the product they belong to — for the social-proof band. */
export async function getFeaturedReviews(
  limit = 6
): Promise<(Review & { product?: { name: string; slug: string } })[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, product:products(name, slug)")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as (Review & { product?: { name: string; slug: string } })[] | null) ?? [];
}

// ---------------------------------------------------------------------
// Catalog: filtered / sorted / paginated product listing + facets
// ---------------------------------------------------------------------
import type { CatalogScope, ProductFilters } from "@/lib/filters";
import { PAGE_SIZE } from "@/lib/filters";

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return (data as Category | null) ?? null;
}

/** Strip characters that would break a PostgREST or() expression. */
function sanitize(q: string): string {
  return q.replace(/[,()%*]/g, " ").trim();
}

interface CatalogQuery extends ProductFilters {
  categoryId?: string;
  scope: CatalogScope;
}

export async function getProducts(
  args: CatalogQuery
): Promise<{ products: Product[]; total: number }> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS, { count: "exact" })
    .eq("active", true);

  if (args.categoryId) query = query.eq("category_id", args.categoryId);
  if (args.scope.newArrival) query = query.eq("new_arrival", true);
  if (args.scope.bestSeller) query = query.eq("best_seller", true);
  if (args.scope.onSale) query = query.not("sale_price", "is", null);

  const q = sanitize(args.q);
  if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,sku.ilike.%${q}%`);

  if (args.brands.length) query = query.in("brand", args.brands);
  if (args.minPrice !== undefined) query = query.gte("effective_price", args.minPrice);
  if (args.maxPrice !== undefined) query = query.lte("effective_price", args.maxPrice);
  if (args.inStock) query = query.gt("stock_quantity", 0);
  if (args.minRating) query = query.gte("avg_rating", args.minRating);

  switch (args.sort) {
    case "popular":
      query = query.order("best_seller", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "price_asc":
      query = query.order("effective_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("effective_price", { ascending: false });
      break;
    case "rated":
      query = query.order("avg_rating", { ascending: false }).order("review_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (args.page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data, count, error } = await query;
  if (error) console.error("getProducts:", error.message);
  return { products: (data as Product[] | null) ?? [], total: count ?? 0 };
}

/** Brand list + price range available within a scope, for building the filter UI. */
export async function getFilterFacets(args: {
  categoryId?: string;
  scope: CatalogScope;
}): Promise<{ brands: string[]; priceMin: number; priceMax: number }> {
  const supabase = createClient();
  let query = supabase
    .from("products")
    .select("brand, effective_price")
    .eq("active", true)
    .limit(2000);

  if (args.categoryId) query = query.eq("category_id", args.categoryId);
  if (args.scope.newArrival) query = query.eq("new_arrival", true);
  if (args.scope.bestSeller) query = query.eq("best_seller", true);
  if (args.scope.onSale) query = query.not("sale_price", "is", null);

  const { data } = await query;
  const rows = (data as { brand: string | null; effective_price: number | null }[] | null) ?? [];

  const brands = Array.from(new Set(rows.map((r) => r.brand).filter((b): b is string => !!b))).sort();
  const prices = rows.map((r) => Number(r.effective_price ?? 0)).filter((n) => n > 0);
  const priceMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const priceMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  return { brands, priceMin, priceMax };
}

// ---------------------------------------------------------------------
// Product detail
// ---------------------------------------------------------------------

/** Complementary categories for the "You may also need" rail. */
const COMPLEMENTS: Record<string, string[]> = {
  cameras: ["lenses", "accessories", "lighting", "audio"],
  lenses: ["cameras", "accessories"],
  accessories: ["cameras", "lenses"],
  lighting: ["cameras", "accessories"],
  audio: ["cameras", "accessories"],
  electronics: ["accessories"],
};

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return (data as Product | null) ?? null;
});

/** All active product slugs — for static params / sitemap. */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase.from("products").select("slug").eq("active", true);
  return (data as { slug: string }[] | null)?.map((r) => r.slug) ?? [];
}

/** More products from the same category. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.category_id) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .order("best_seller", { ascending: false })
    .limit(limit);
  return (data as Product[] | null) ?? [];
}

/** Products from complementary categories — e.g. a camera suggests lenses & memory. */
export async function getComplementaryProducts(product: Product, limit = 4): Promise<Product[]> {
  const slug = product.category?.slug;
  const wanted = slug ? COMPLEMENTS[slug] : undefined;
  if (!wanted?.length) return [];
  const supabase = createClient();
  const cats = await getCategories();
  const ids = cats.filter((c) => wanted.includes(c.slug)).map((c) => c.id);
  if (!ids.length) return [];
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .in("category_id", ids)
    .neq("id", product.id)
    .order("best_seller", { ascending: false })
    .limit(limit);
  return (data as Product[] | null) ?? [];
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(20);
  return (data as Review[] | null) ?? [];
}

// ---------------------------------------------------------------------
// Account (RLS scopes these to the signed-in user automatically)
// ---------------------------------------------------------------------
import type { Order } from "@/types/database";

export async function getUserOrders(limit?: number): Promise<Order[]> {
  const supabase = createClient();
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query;
  return (data as Order[] | null) ?? [];
}

export async function getUserOrder(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Order | null) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const supabase = createClient();
  const { data } = await supabase.from("products").select(PRODUCT_COLUMNS).in("id", ids).eq("active", true);
  return (data as Product[] | null) ?? [];
}
