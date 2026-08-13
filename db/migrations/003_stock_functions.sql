-- =====================================================================
-- Migration 003 — stock decrement helpers
-- Called (with the service role) after a payment is verified, to reduce
-- inventory atomically. Safe to run once on top of 002.
-- (Also folded into db/schema.sql for fresh installs.)
-- =====================================================================

create or replace function public.decrement_product_stock(p_id uuid, p_qty int)
returns void language sql security definer set search_path = public as $$
  update public.products
     set stock_quantity = greatest(0, stock_quantity - p_qty)
   where id = p_id;
$$;

create or replace function public.decrement_variant_stock(v_id uuid, p_qty int)
returns void language sql security definer set search_path = public as $$
  update public.product_variants
     set stock_quantity = greatest(0, stock_quantity - p_qty)
   where id = v_id;
$$;
