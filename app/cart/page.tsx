"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ImageOff, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { CartLineRow } from "@/components/cart/cart-line-row";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const { items, saved, subtotal, moveToCart, removeSaved } = useCart();

  return (
    <div className="container-screen py-10 md:py-14">
      <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-8">Your cart</h1>

      {items.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-black/15 bg-mist/50 px-6 py-20 text-center">
          <ShoppingBag size={34} className="mx-auto text-slate/50 mb-3" />
          <p className="font-medium">Your cart is empty</p>
          <p className="text-sm text-slate mt-1 mb-6">Browse the store and add gear to your cart.</p>
          <Link href="/shop" className="btn-accent">Browse the store</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
              {items.map((l) => (
                <CartLineRow key={`${l.productId}-${l.variantId ?? ""}`} line={l} />
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-mist rounded-[6px] p-6">
              <h2 className="font-display font-semibold text-lg mb-4">Order summary</h2>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate">Subtotal</span>
                <span className="font-mono font-medium">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-slate">Delivery</span>
                <span className="font-mono text-slate">At checkout</span>
              </div>
              <Link href="/checkout" className="btn-accent w-full">
                Proceed to checkout <ArrowRight size={17} />
              </Link>
              <Link href="/shop" className="block text-center text-sm text-ink hover:text-accent-press mt-3">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}

      {saved.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display font-semibold text-xl mb-4">Saved for later</h2>
          <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
            {saved.map((l) => (
              <div key={`${l.productId}-${l.variantId ?? ""}`} className="flex gap-3 py-4 items-center">
                <Link href={`/product/${l.slug}`} className="relative w-16 h-16 shrink-0 bg-mist rounded-[3px] overflow-hidden">
                  {l.image ? <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-slate/40"><ImageOff size={18} /></span>}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${l.slug}`} className="font-medium text-sm line-clamp-1 hover:text-accent-press">{l.name}</Link>
                  <p className="font-mono text-sm text-slate mt-0.5">{formatNaira(l.price)}</p>
                </div>
                <button onClick={() => moveToCart(l.productId, l.variantId)} className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-accent-press">
                  <Plus size={13} /> Move to cart
                </button>
                <button onClick={() => removeSaved(l.productId, l.variantId)} aria-label="Remove" className="text-slate hover:text-red-600 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
