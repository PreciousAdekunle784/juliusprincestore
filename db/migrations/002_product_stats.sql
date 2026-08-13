-- =====================================================================
-- Migration 002 — product stats
-- Adds an effective_price (sale-aware) column for correct price sorting,
-- and denormalised avg_rating / review_count maintained from approved reviews.
-- Safe to run once on a database already created from schema.sql (v1).
-- (These statements are also folded into db/schema.sql for fresh installs.)
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
