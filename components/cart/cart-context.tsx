"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartLine } from "@/types/database";

const CART_KEY = "jp_cart";
const SAVED_KEY = "jp_saved";

interface CartContextValue {
  items: CartLine[];
  saved: CartLine[];
  count: number;
  subtotal: number;
  addItem: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  saveForLater: (productId: string, variantId?: string) => void;
  moveToCart: (productId: string, variantId?: string) => void;
  removeSaved: (productId: string, variantId?: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const sameLine = (a: CartLine, productId: string, variantId?: string) =>
  a.productId === productId && (a.variantId ?? null) === (variantId ?? null);

function usePersisted(key: string) {
  const [value, setValue] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [key]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);
  return [value, setValue] as const;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = usePersisted(CART_KEY);
  const [saved, setSaved] = usePersisted(SAVED_KEY);
  const [open, setOpen] = useState(false);

  const addItem = useCallback((line: Omit<CartLine, "quantity">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((l) => sameLine(l, line.productId, line.variantId));
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.min(next[idx].quantity + qty, line.maxStock || 99) };
        return next;
      }
      return [...prev, { ...line, quantity: Math.min(qty, line.maxStock || 99) }];
    });
    setOpen(true);
  }, [setItems]);

  const updateQty = useCallback((productId: string, variantId: string | undefined, qty: number) => {
    setItems((prev) =>
      prev
        .map((l) => (sameLine(l, productId, variantId) ? { ...l, quantity: Math.max(1, Math.min(qty, l.maxStock || 99)) } : l))
        .filter((l) => l.quantity > 0)
    );
  }, [setItems]);

  const removeItem = useCallback((productId: string, variantId?: string) => {
    setItems((prev) => prev.filter((l) => !sameLine(l, productId, variantId)));
  }, [setItems]);

  const move = useCallback(
    (from: typeof setItems, to: typeof setItems, productId: string, variantId?: string) => {
      from((prev) => {
        const line = prev.find((l) => sameLine(l, productId, variantId));
        if (line) to((t) => (t.some((l) => sameLine(l, productId, variantId)) ? t : [...t, line]));
        return prev.filter((l) => !sameLine(l, productId, variantId));
      });
    },
    []
  );

  const saveForLater = useCallback((p: string, v?: string) => move(setItems, setSaved, p, v), [move, setItems, setSaved]);
  const moveToCart = useCallback((p: string, v?: string) => move(setSaved, setItems, p, v), [move, setItems, setSaved]);
  const removeSaved = useCallback((p: string, v?: string) => {
    setSaved((prev) => prev.filter((l) => !sameLine(l, p, v)));
  }, [setSaved]);

  const clear = useCallback(() => setItems([]), [setItems]);

  const count = items.reduce((n, l) => n + l.quantity, 0);
  const subtotal = items.reduce((s, l) => s + l.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, saved, count, subtotal, addItem, updateQty, removeItem, saveForLater, moveToCart, removeSaved, clear, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
