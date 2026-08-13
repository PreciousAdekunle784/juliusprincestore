"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "jp_wishlist";

interface WishlistContextValue {
  ids: string[];
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;

  const loadFromDb = useCallback(
    async (uid: string) => {
      const { data } = await supabase.from("wishlist").select("product_id").eq("user_id", uid);
      setIds(((data as { product_id: string }[] | null) ?? []).map((r) => r.product_id));
    },
    [supabase]
  );

  const loadFromLocal = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setIds(raw ? JSON.parse(raw) : []);
    } catch {
      setIds([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (user) { setUserId(user.id); await loadFromDb(user.id); }
      else { setUserId(null); loadFromLocal(); }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const user = session?.user ?? null;
      if (user) { setUserId(user.id); loadFromDb(user.id); }
      else { setUserId(null); loadFromLocal(); }
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [supabase, loadFromDb, loadFromLocal]);

  useEffect(() => {
    if (!userId) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
    }
  }, [ids, userId]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const on = prev.includes(id);
        if (userId) {
          if (on) supabase.from("wishlist").delete().eq("user_id", userId).eq("product_id", id).then(() => {});
          else supabase.from("wishlist").insert({ user_id: userId, product_id: id }).then(() => {});
        }
        return on ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [userId, supabase]
  );

  return (
    <WishlistContext.Provider value={{ ids, has, toggle, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
