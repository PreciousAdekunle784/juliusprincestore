"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/database";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      if (ids.length === 0) { if (active) { setProducts([]); setLoading(false); } return; }
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*, category:categories(*)").in("id", ids).eq("active", true);
      if (active) { setProducts((data as Product[] | null) ?? []); setLoading(false); }
    })();
    return () => { active = false; };
  }, [ids]);

  return (
    <div className="container-screen py-10 md:py-14">
      <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-8">Wishlist</h1>

      {loading ? (
        <div className="py-20 grid place-items-center"><Loader2 className="animate-spin text-slate" /></div>
      ) : products.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-black/15 bg-mist/50 px-6 py-20 text-center">
          <Heart size={32} className="mx-auto text-slate/50 mb-3" />
          <p className="font-medium">Your wishlist is empty</p>
          <p className="text-sm text-slate mt-1 mb-6">Tap the heart on any product to save it here.</p>
          <Link href="/shop" className="btn-accent">Browse the store</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
