"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { useCart } from "./cart-context";
import { CartLineRow } from "./cart-line-row";

export function CartDrawer() {
  const { items, subtotal, open, setOpen, count } = useCart();

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-paper flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-black/10">
          <p className="font-display font-semibold flex items-center gap-2">
            <ShoppingBag size={18} /> Cart <span className="font-mono text-sm text-slate">({count})</span>
          </p>
          <button onClick={() => setOpen(false)} aria-label="Close cart" className="p-2 text-ink hover:text-accent-press">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <ShoppingBag size={34} className="mx-auto text-slate/50 mb-3" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-slate mt-1 mb-5">Add some gear to get started.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn-accent">Browse the store</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 divide-y divide-black/[0.06]">
              {items.map((l) => (
                <CartLineRow key={`${l.productId}-${l.variantId ?? ""}`} line={l} compact />
              ))}
            </div>
            <div className="border-t border-black/10 p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate">Subtotal</span>
                <span className="font-mono font-medium text-base">{formatNaira(subtotal)}</span>
              </div>
              <p className="text-xs text-slate">Delivery calculated at checkout.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-accent w-full">
                Proceed to checkout <ArrowRight size={17} />
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="block text-center text-sm text-ink hover:text-accent-press">
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
