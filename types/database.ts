/**
 * Hand-written types mirroring the Supabase schema (julius-prince-schema.sql).
 * Once your project is live you can replace these with generated types:
 *   npx supabase gen types typescript --project-id <id> > types/supabase.ts
 */

export type UserRole = "customer" | "admin";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type DiscountType = "percentage" | "fixed";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
}

/** JSON blob shape for products.specifications, e.g. { "Sensor": "Full-frame", "Mount": "E" } */
export type Specifications = Record<string, string>;

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  category_id: string | null;
  images: string[];
  specifications: Specifications;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  active: boolean;
  effective_price?: number;
  avg_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
  // convenience joins (populated by select queries when requested)
  category?: Category | null;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  stock_quantity: number;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  address: string;
  city: string | null;
  state: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  state: string | null;
  delivery_method: string | null;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  payment_method: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_ref: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  review: string | null;
  approved: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  active: boolean;
  expiry_date: string | null;
  created_at: string;
}

/** A line in the client-side cart (persisted in localStorage until checkout). */
export interface CartLine {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  maxStock: number;
}
