"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Check, ImageOff, GitCompare } from "lucide-react";
import type { Product } from "@/types/database";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useCompare } from "@/components/compare/compare-context";
import { Price } from "@/components/product/price";
import { QuickView } from "@/components/product/quick-view";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { has: inCompare, toggle: toggleCompare, isFull } = useCompare();
  const [added, setAdded] = useState(false);
  const [quick, setQuick] = useState(false);

  const img = product.images?.[0];
  const inStock = product.stock_quantity > 0;
  const keySpec = product.specifications
    ? Object.entries(product.specifications)[0]
    : undefined;
  const saved = has(product.id);

  function add() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.sale_price ?? product.price,
      image: img,
      maxStock: product.stock_quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="group relative flex flex-col bg-paper border border-black/[0.07] rounded-[4px] overflow-hidden transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* media */}
      <div className="relative aspect-square bg-mist overflow-hidden">
        <Link href={`/product/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-slate/50">
              <ImageOff size={28} />
            </span>
          )}
        </Link>

        {/* flags */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
          {product.new_arrival && (
            <span className="eyebrow text-[0.55rem] bg-ink text-paper px-1.5 py-0.5 rounded-[2px]">New</span>
          )}
          {!inStock && (
            <span className="eyebrow text-[0.55rem] bg-slate text-paper px-1.5 py-0.5 rounded-[2px]">Sold out</span>
          )}
        </div>

        {/* wishlist */}
        <button
          onClick={() => toggle(product.id)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-2.5 top-2.5 grid place-items-center h-8 w-8 rounded-full bg-paper/90 backdrop-blur text-ink hover:text-accent-press shadow-sm"
        >
          <Heart size={16} className={cn(saved && "fill-accent text-accent")} />
        </button>

        {/* compare */}
        <button
          onClick={() => toggleCompare(product.id)}
          disabled={!inCompare(product.id) && isFull}
          aria-label={inCompare(product.id) ? "Remove from comparison" : "Add to comparison"}
          aria-pressed={inCompare(product.id)}
          title={!inCompare(product.id) && isFull ? "Compare list is full (4 max)" : "Compare"}
          className={cn(
            "absolute right-2.5 top-12 grid place-items-center h-8 w-8 rounded-full bg-paper/90 backdrop-blur shadow-sm disabled:opacity-40",
            inCompare(product.id) ? "text-accent-press" : "text-ink hover:text-accent-press"
          )}
        >
          <GitCompare size={15} className={cn(inCompare(product.id) && "text-accent")} />
        </button>

        {/* quick view (hover / focus reveal, always tappable on touch) */}
        <button
          onClick={() => setQuick(true)}
          className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-center gap-1.5 h-9 rounded-[3px] bg-ink/90 text-paper text-xs font-medium backdrop-blur
          opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 md:flex"
        >
          <Eye size={15} /> Quick view
        </button>
      </div>

      {/* body */}
      <div className="flex flex-col gap-1.5 p-3.5">
        {product.brand && <span className="eyebrow text-slate">{product.brand}</span>}
        <Link
          href={`/product/${product.slug}`}
          className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent-press"
        >
          {product.name}
        </Link>
        {keySpec && (
          <p className="font-mono text-[0.7rem] text-slate truncate">
            {keySpec[0]}: {keySpec[1]}
          </p>
        )}
        <Price price={product.price} salePrice={product.sale_price} className="mt-0.5" />

        <button
          onClick={add}
          disabled={!inStock}
          className={cn(
            "mt-2 inline-flex items-center justify-center gap-2 h-10 rounded-[3px] text-sm font-semibold transition-colors",
            inStock
              ? "bg-ink text-paper hover:bg-accent hover:text-ink"
              : "bg-mist text-slate cursor-not-allowed"
          )}
        >
          {added ? (
            <><Check size={16} /> Added</>
          ) : inStock ? (
            <><ShoppingBag size={16} /> Add to cart</>
          ) : (
            "Out of stock"
          )}
        </button>
      </div>

      {quick && <QuickView product={product} onClose={() => setQuick(false)} onAdd={add} />}
    </div>
  );
}
