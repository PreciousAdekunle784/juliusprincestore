"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { ProductInput, CouponInput, VariantInput } from "@/types/admin";
import type { OrderStatus, PaymentStatus } from "@/types/database";

function cleanProduct(input: ProductInput) {
  return {
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: input.description.trim() || null,
    brand: input.brand.trim() || null,
    sku: input.sku.trim() || null,
    price: Number(input.price) || 0,
    sale_price: input.sale_price != null && input.sale_price !== 0 ? Number(input.sale_price) : null,
    stock_quantity: Math.max(0, Math.floor(Number(input.stock_quantity) || 0)),
    category_id: input.category_id || null,
    images: input.images.filter(Boolean),
    specifications: input.specifications,
    featured: input.featured,
    best_seller: input.best_seller,
    new_arrival: input.new_arrival,
    on_sale: input.on_sale,
    active: input.active,
  };
}

export async function createProduct(input: ProductInput) {
  await requireAdmin();
  const supabase = createClient();
  const { data, error } = await supabase.from("products").insert(cleanProduct(input)).select("id").single();
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { id: data.id as string };
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").update(cleanProduct(input)).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath(`/product/${input.slug}`);
  revalidatePath("/");
  return {};
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return {};
}

export async function toggleProductActive(id: string, active: boolean) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("products").update({ active }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return {};
}

export async function addVariant(productId: string, v: VariantInput) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    name: v.name.trim(),
    sku: v.sku?.trim() || null,
    price: v.price != null && v.price !== 0 ? Number(v.price) : null,
    stock_quantity: Math.max(0, Math.floor(Number(v.stock_quantity) || 0)),
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/products/${productId}`);
  return {};
}

export async function deleteVariant(id: string, productId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("product_variants").delete().eq("id", id);
  revalidatePath(`/admin/products/${productId}`);
  return {};
}

export async function updateOrder(
  id: string,
  patch: { payment_status?: PaymentStatus; order_status?: OrderStatus }
) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return {};
}

export async function createCoupon(input: CouponInput) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("coupons").insert({
    code: input.code.trim().toUpperCase(),
    discount_type: input.discount_type,
    discount_value: Number(input.discount_value) || 0,
    active: input.active,
    expiry_date: input.expiry_date || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/coupons");
  return {};
}

export async function toggleCoupon(id: string, active: boolean) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("coupons").update({ active }).eq("id", id);
  revalidatePath("/admin/coupons");
  return {};
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("coupons").delete().eq("id", id);
  revalidatePath("/admin/coupons");
  return {};
}
