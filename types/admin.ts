export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  brand: string;
  sku: string;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  category_id: string | null;
  images: string[];
  specifications: Record<string, string>;
  featured: boolean;
  best_seller: boolean;
  new_arrival: boolean;
  on_sale: boolean;
  active: boolean;
}

export interface CouponInput {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  active: boolean;
  expiry_date: string | null;
}

export interface VariantInput {
  name: string;
  sku: string | null;
  price: number | null;
  stock_quantity: number;
}
