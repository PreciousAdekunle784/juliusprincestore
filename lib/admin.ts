import { createClient } from "@/lib/supabase/server";
import type { Product, Order, Profile, Coupon } from "@/types/database";

export async function getAdminProducts(search?: string): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false });
  if (search) query = query.ilike("name", `%${search.replace(/[%,()]/g, " ")}%`);
  const { data } = await query.limit(200);
  return (data as Product[] | null) ?? [];
}

export async function getAdminProduct(id: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as Product | null) ?? null;
}

export async function getAdminOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(id)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data as Order[] | null) ?? [];
}

export async function getAdminOrder(id: string): Promise<Order | null> {
  const supabase = createClient();
  const { data } = await supabase.from("orders").select("*, items:order_items(*)").eq("id", id).maybeSingle();
  return (data as Order | null) ?? null;
}

export async function getCustomers(): Promise<Profile[]> {
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
  return (data as Profile[] | null) ?? [];
}

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = createClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  return (data as Coupon[] | null) ?? [];
}

export async function getDashboardStats() {
  const supabase = createClient();
  const count = async (table: string, build?: (q: any) => any) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (build) q = build(q);
    const { count } = await q;
    return count ?? 0;
  };
  const [products, orders, pendingOrders, customers] = await Promise.all([
    count("products"),
    count("orders"),
    count("orders", (q) => q.eq("order_status", "pending")),
    count("profiles", (q) => q.eq("role", "customer")),
  ]);
  return { products, orders, pendingOrders, customers };
}
