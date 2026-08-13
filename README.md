# Julius Prince Store

Premium camera, photography-gear and electronics e-commerce platform.
**Next.js (App Router) · TypeScript · Tailwind · Supabase.**

---

## Design system — "the light meter"

Photography is the craft of controlling light, so the store runs on a
camera-body monochrome base with a single **golden-hour amber** accent.

| Token | Hex | Use |
|-------|-----|-----|
| `ink` | `#0B0B0C` | camera-body black — primary dark surface / text |
| `charcoal` | `#16161A` | raised dark surface |
| `graphite` | `#26262B` | borders / dividers on dark |
| `slate` | `#6C6C74` | muted text |
| `mist` | `#F5F5F4` | light surface background |
| `paper` | `#FFFFFF` | base |
| `accent` | `#E8A13C` | the one accent — actions, focus frame |

- **Display:** Archivo (engraved-feeling headlines)
- **Body:** IBM Plex Sans
- **Data:** IBM Plex Mono — every price, spec, SKU and f-stop reads like a camera readout
- **Signature:** the amber **focus-frame** corner brackets (`components/ui/focus-frame.tsx`)

---

## Getting started

1. **Create a Supabase project** at supabase.com.

2. **Run the schema.** Open the Supabase SQL Editor, paste in the entire
   `db/schema.sql`, and run it. It's self-contained and re-runnable: it creates
   every table, Row Level Security policy, function, trigger and index, and seeds
   the categories. You do **not** need the files in `db/migrations/` — their
   contents are already folded into `db/schema.sql` (they're kept only as a
   change log). Running the whole file should end with "Success".

3. **Environment variables.** A ready-to-fill `.env.local` is included in the
   project root — open it and paste your real values (it's the file Next.js
   actually loads; `.env.example` is just a reference copy). At minimum:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_WHATSAPP_NUMBER=234...      # store WhatsApp line
   ```
   The Supabase URL + anon key are in your Supabase dashboard under
   **Project Settings → API**. For checkout you also need:
   ```
   SUPABASE_SERVICE_ROLE_KEY=...            # server-only; confirms orders + decrements stock
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=...      # (card payments)
   PAYSTACK_SECRET_KEY=...
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=...   # (optional alternative)
   FLUTTERWAVE_SECRET_KEY=...
   ```
   Set `NEXT_PUBLIC_SITE_URL` to your real domain in production so payment
   callbacks resolve. Update the bank-transfer account details in `lib/site.ts`.
   **Restart `npm run dev` after editing `.env.local`** — env changes are only
   picked up on restart.

4. **Install & run.**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

5. **Make yourself admin.** Sign up through the site (auth pages land in a later
   step), then in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

---

## Project structure

```
app/                 route segments (App Router)
  layout.tsx         fonts + chrome (announcement, nav, footer, WhatsApp)
  page.tsx           homepage
  globals.css        design tokens + base styles
components/
  layout/            announcement bar, navbar, mobile menu, footer, WhatsApp
  ui/                logo, focus-frame signature, (product cards etc. next)
lib/
  supabase/          browser + server clients, session middleware
  format.ts          Naira formatting, discount math
  site.ts            store config + navigation
  utils.ts           cn() class merge
types/database.ts    types mirroring the schema
middleware.ts        refreshes the Supabase session on every request
```

---

## Build roadmap

- [x] **1. Database & security** — schema, RLS, triggers (`julius-prince-schema.sql`)
- [x] **2. Foundation** — scaffold, Supabase wiring, design system, site chrome
- [x] **3. Data layer + homepage** — queries, category grid, featured / best-sellers / new-arrivals, trust + final CTA (product cards, cart & wishlist state live; every route stubbed so nothing 404s)
- [x] **4. Shop + category pages** — grid, search, brand/price/availability/rating filters, sorting, pagination; `/shop`, all category pages, `/deals`, `/new-arrivals`, `/best-sellers`
- [x] **5. Product detail** — gallery, sale-aware buy box (variants, qty, Buy now, wishlist, WhatsApp, sticky mobile bar), specs table, reviews, related + "you may also need" rails, per-product SEO (metadata, JSON-LD, sitemap, robots)
- [x] **6. Cart + checkout** — slide-out drawer, `/cart` with save-for-later, server-priced Nigerian checkout, Paystack / Flutterwave / bank transfer, payment verified before an order is marked paid, stock decremented on success
- [x] **7. Auth** — email/password + Google OAuth, register, forgot / reset password, email confirmation, `/auth/callback`
- [x] **8. Customer account** — overview, orders + order tracking timeline, addresses CRUD, profile & password, database-backed wishlist (syncs on sign-in)
- [x] **9. Admin dashboard** — dashboard stats, product CRUD + variants, order management with status updates, customers, coupons (all writes via server actions, admin-locked by RLS)
- [x] **10. Product comparison** (up to 4, side-by-side spec table), Organization + WebSite JSON-LD with sitelinks search, route loading skeletons

> **Products are never invented.** Category / product pages are built against
> placeholder structure until the real Julius Prince catalog (Instagram handle
> or a product list with names, prices, images and specs) is dropped in.


## Auth & admin setup

- **Google sign-in** is optional — the button appears everywhere but only works once you enable the Google provider in Supabase (Authentication → Providers). Email/password works with no extra setup.
- **Password reset & email confirmation** use Supabase's email templates. Point their redirect at `https://yourdomain/auth/callback`.
- **Make yourself an admin:** after registering, run in the Supabase SQL editor:
  ```sql
  update profiles set role = 'admin' where email = 'you@example.com';
  ```
  Then `/admin` unlocks (it redirects non-admins away).
- **Product images** in the admin are URL-based — paste public image URLs (e.g. from a Supabase Storage bucket). The schema stores an image array, so wiring direct uploads later needs no data change.
