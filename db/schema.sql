-- =====================================================================
-- JULIUS PRINCE STORE — SUPABASE DATABASE SCHEMA
-- =====================================================================
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- It is idempotent-ish: safe to run once on a fresh project.
--
-- Covers every table in the brief (§25) plus two the app genuinely
-- needs: `addresses` (customer account manages delivery addresses, §23)
-- and `product_variants` (product variants, §16/§24).
--
-- Security model:
--   • Products / categories / approved reviews  -> public read
--   • profiles / orders / wishlist / addresses   -> owner-only
--   • Everything write-sensitive                 -> admin-only
--   • Admin = a row in `profiles` with role = 'admin'
-- =====================================================================

-- Supabase already ships pgcrypto (gen_random_uuid). Kept explicit for portability.
create extension if not exists pgcrypto;

-- Allow functions to reference tables that are created later in this script
-- (e.g. is_admin() references profiles). Scoped to this run.
set check_function_bodies = false;

-- ---------------------------------------------------------------------
-- Helper: is the current auth user an admin?
-- SECURITY DEFINER so it can read profiles.role without tripping RLS.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- PROFILES  (1:1 with auth.users)
-- =====================================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- CATEGORIES
-- =====================================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image       text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- PRODUCTS
-- =====================================================================
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text,
  brand          text,
  sku            text unique,
  price          numeric(12,2) not null default 0,
  sale_price     numeric(12,2),
  stock_quantity int not null default 0,
  category_id    uuid references public.categories(id) on delete set null,
  images         jsonb not null default '[]'::jsonb,   -- array of image URLs
  specifications jsonb not null default '{}'::jsonb,   -- { "Brand": "...", "Model": "..." }
  featured       boolean not null default false,
  best_seller    boolean not null default false,
  new_arrival    boolean not null default false,
  on_sale        boolean not null default false,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =====================================================================
-- PRODUCT VARIANTS  (e.g. kit / body-only, colour, capacity)
-- =====================================================================
create table if not exists public.product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  name           text not null,        -- "Kit (18-55mm)", "Black", "128GB"
  sku            text unique,
  price          numeric(12,2),        -- overrides product price when set
  stock_quantity int not null default 0,
  created_at     timestamptz not null default now()
);

-- =====================================================================
-- ADDRESSES  (customer delivery addresses)
-- =====================================================================
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  address     text not null,
  city        text,
  state       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- ORDERS
-- =====================================================================
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  -- customer details captured at checkout (guest-friendly)
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  delivery_address text not null,
  state            text,
  delivery_method  text,
  subtotal         numeric(12,2) not null default 0,
  delivery_fee     numeric(12,2) not null default 0,
  discount         numeric(12,2) not null default 0,
  total            numeric(12,2) not null default 0,
  coupon_code      text,
  payment_method   text,   -- 'paystack' | 'flutterwave' | 'bank_transfer'
  payment_status   text not null default 'pending'
                     check (payment_status in ('pending','paid','failed','refunded')),
  order_status     text not null default 'pending'
                     check (order_status in
                       ('pending','confirmed','processing','shipped','delivered','cancelled')),
  payment_ref      text,   -- provider transaction reference (set after verify)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =====================================================================
-- ORDER ITEMS  (price snapshotted at purchase time)
-- =====================================================================
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  variant_id   uuid references public.product_variants(id) on delete set null,
  product_name text not null,        -- snapshot in case product is later edited/deleted
  quantity     int not null default 1 check (quantity > 0),
  price        numeric(12,2) not null
);

-- =====================================================================
-- WISHLIST
-- =====================================================================
create table if not exists public.wishlist (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- =====================================================================
-- REVIEWS
-- =====================================================================
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating     int not null check (rating between 1 and 5),
  review     text,
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- COUPONS
-- =====================================================================
create table if not exists public.coupons (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique,
  discount_type  text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2) not null,
  active         boolean not null default true,
  expiry_date    date,
  created_at     timestamptz not null default now()
);

-- Public-safe coupon validation (avoids exposing the whole coupon table).
create or replace function public.validate_coupon(coupon_code text)
returns table (code text, discount_type text, discount_value numeric)
language sql
stable
security definer
set search_path = public
as $$
  select c.code, c.discount_type, c.discount_value
  from public.coupons c
  where upper(c.code) = upper(coupon_code)
    and c.active = true
    and (c.expiry_date is null or c.expiry_date >= current_date);
$$;

-- =====================================================================
-- INDEXES
-- =====================================================================
create index if not exists idx_products_category   on public.products(category_id);
create index if not exists idx_products_active      on public.products(active);
create index if not exists idx_products_flags       on public.products(featured, best_seller, new_arrival);
create index if not exists idx_variants_product     on public.product_variants(product_id);
create index if not exists idx_orders_user          on public.orders(user_id);
create index if not exists idx_order_items_order    on public.order_items(order_id);
create index if not exists idx_wishlist_user        on public.wishlist(user_id);
create index if not exists idx_reviews_product      on public.reviews(product_id);
create index if not exists idx_addresses_user       on public.addresses(user_id);
-- simple full-text-ish search across name / brand / sku
create index if not exists idx_products_search
  on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(brand,'') || ' ' || coalesce(sku,'')));

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_variants enable row level security;
alter table public.addresses        enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.wishlist         enable row level security;
alter table public.reviews          enable row level security;
alter table public.coupons          enable row level security;

-- ---- PROFILES --------------------------------------------------------
drop policy if exists "profiles: owner or admin can read" on public.profiles;
create policy "profiles: owner or admin can read"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: owner can update self" on public.profiles;
create policy "profiles: owner can update self"
  on public.profiles for update
  using (id = auth.uid());

-- ---- CATEGORIES ------------------------------------------------------
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read"
  on public.categories for select using (true);
drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write"
  on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- ---- PRODUCTS --------------------------------------------------------
drop policy if exists "products: public reads active" on public.products;
create policy "products: public reads active"
  on public.products for select
  using (active = true or public.is_admin());
drop policy if exists "products: admin write" on public.products;
create policy "products: admin write"
  on public.products for all using (public.is_admin()) with check (public.is_admin());

-- ---- PRODUCT VARIANTS ------------------------------------------------
drop policy if exists "variants: public read" on public.product_variants;
create policy "variants: public read"
  on public.product_variants for select using (true);
drop policy if exists "variants: admin write" on public.product_variants;
create policy "variants: admin write"
  on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

-- ---- ADDRESSES -------------------------------------------------------
drop policy if exists "addresses: owner all" on public.addresses;
create policy "addresses: owner all"
  on public.addresses for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- ORDERS ----------------------------------------------------------
drop policy if exists "orders: owner or admin read" on public.orders;
create policy "orders: owner or admin read"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders: user creates own" on public.orders;
create policy "orders: user creates own"
  on public.orders for insert
  with check (user_id = auth.uid() or user_id is null);  -- allow guest checkout
drop policy if exists "orders: admin updates" on public.orders;
create policy "orders: admin updates"
  on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

-- ---- ORDER ITEMS -----------------------------------------------------
drop policy if exists "order_items: read via own order or admin" on public.order_items;
create policy "order_items: read via own order or admin"
  on public.order_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );
drop policy if exists "order_items: insert via own order" on public.order_items;
create policy "order_items: insert via own order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

-- ---- WISHLIST --------------------------------------------------------
drop policy if exists "wishlist: owner all" on public.wishlist;
create policy "wishlist: owner all"
  on public.wishlist for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- REVIEWS ---------------------------------------------------------
drop policy if exists "reviews: public reads approved" on public.reviews;
create policy "reviews: public reads approved"
  on public.reviews for select
  using (approved = true or user_id = auth.uid() or public.is_admin());
drop policy if exists "reviews: user creates own" on public.reviews;
create policy "reviews: user creates own"
  on public.reviews for insert
  with check (user_id = auth.uid());
drop policy if exists "reviews: admin moderates" on public.reviews;
create policy "reviews: admin moderates"
  on public.reviews for update
  using (public.is_admin()) with check (public.is_admin());

-- ---- COUPONS ---------------------------------------------------------
-- No public SELECT (codes stay secret; use validate_coupon()). Admin manages.
drop policy if exists "coupons: admin all" on public.coupons;
create policy "coupons: admin all"
  on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- SEED: categories only (real products come from the actual catalog)
-- =====================================================================
insert into public.categories (name, slug, sort_order) values
  ('Cameras',      'cameras',      1),
  ('Lenses',       'lenses',       2),
  ('Accessories',  'accessories',  3),
  ('Lighting',     'lighting',     4),
  ('Audio',        'audio',        5),
  ('Electronics',  'electronics',  6),
  ('Deals',        'deals',        7)
on conflict (slug) do nothing;

-- =====================================================================
-- PRODUCT STATS (effective price + denormalised ratings)
-- =====================================================================
alter table public.products
  add column if not exists effective_price numeric(12,2)
    generated always as (coalesce(sale_price, price)) stored;

alter table public.products
  add column if not exists avg_rating numeric(3,2) not null default 0;

alter table public.products
  add column if not exists review_count int not null default 0;

create index if not exists idx_products_effprice on public.products(effective_price);
create index if not exists idx_products_rating on public.products(avg_rating desc);

-- Recompute one product's rating from its approved reviews.
create or replace function public.recompute_product_rating(p_product uuid)
returns void language sql security definer set search_path = public as $$
  update public.products p set
    avg_rating = coalesce(
      (select round(avg(rating)::numeric, 2) from public.reviews r
       where r.product_id = p_product and r.approved), 0),
    review_count = (
      select count(*) from public.reviews r
      where r.product_id = p_product and r.approved)
  where p.id = p_product;
$$;

-- Keep it in sync on any review change.
create or replace function public.reviews_rating_sync()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    perform public.recompute_product_rating(old.product_id);
    return old;
  end if;
  perform public.recompute_product_rating(new.product_id);
  if tg_op = 'UPDATE' and old.product_id <> new.product_id then
    perform public.recompute_product_rating(old.product_id);
  end if;
  return new;
end;
$$;

drop trigger if exists reviews_rating_sync on public.reviews;
create trigger reviews_rating_sync
  after insert or update or delete on public.reviews
  for each row execute function public.reviews_rating_sync();

-- Backfill any existing rows.
update public.products p set
  avg_rating = coalesce(
    (select round(avg(rating)::numeric, 2) from public.reviews r
     where r.product_id = p.id and r.approved), 0),
  review_count = (
    select count(*) from public.reviews r
    where r.product_id = p.id and r.approved);

-- =====================================================================
-- STOCK DECREMENT HELPERS (called after verified payment)
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

-- =====================================================================
-- TO PROMOTE YOURSELF TO ADMIN (run once, after you sign up):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- =====================================================================
