"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap, Heart, MessageCircle, Check, GitCompare } from "lucide-react";
import type { Product, ProductVariant } from "@/types/database";
import { useCart } from "@/components/cart/cart-context";
import { useWishlist } from "@/components/wishlist/wishlist-context";
import { useCompare } from "@/components/compare/compare-context";
import { Price } from "@/components/product/price";
import { formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function BuyBox({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const hasVariants = variants.length > 0;
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { has: inCompare, toggle: toggleCompare, isFull } = useCompare();
  const router = useRouter();

  const [variant, setVariant] = useState<ProductVariant | null>(hasVariants ? variants[0] : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const stock = variant ? variant.stock_quantity : product.stock_quantity;
  const inStock = stock > 0;
  const unitPrice = variant?.price ?? product.sale_price ?? product.price;
  const sku = variant?.sku ?? product.sku;
  const saved = has(product.id);

  const displayName = variant ? `${product.name} — ${variant.name}` : product.name;

  function add() {
    if (!inStock) return;
    addItem(
      {
        productId: product.id,
        variantId: variant?.id,
        name: displayName,
        slug: product.slug,
        price: unitPrice,
        image: product.images?.[0],
        maxStock: stock,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    add();
    router.push("/checkout");
  }

  const askMessage = `Hi Julius Prince Store, I'd like to ask about "${product.name}".`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        {product.brand && <p className="eyebrow text-slate mb-2">{product.brand}</p>}
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight">
          {product.name}
        </h1>
      </div>

      {variant?.price != null ? (
        <span className="font-mono font-medium text-2xl">{formatNaira(variant.price)}</span>
      ) : (
        <Price price={product.price} salePrice={product.sale_price} size="lg" />
      )}

      <div className="flex items-center gap-3 text-sm">
        <span
          className={cn(
            "eyebrow",
            inStock ? "text-accent-press" : "text-slate"
          )}
        >
          {inStock ? `In stock · ${stock} available` : "Out of stock"}
        </span>
        {sku && <span className="font-mono text-xs text-slate">SKU: {sku}</span>}
      </div>

      {/* variants */}
      {hasVariants && (
        <div>
          <p className="eyebrow text-ink mb-2">Options</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const on = variant?.id === v.id;
              const vStock = v.stock_quantity > 0;
              return (
                <button
                  key={v.id}
                  onClick={() => { setVariant(v); setQty(1); }}
                  disabled={!vStock}
                  className={cn(
                    "px-3.5 py-2 rounded-[3px] border text-sm font-medium transition-colors",
                    on ? "border-accent bg-accent/10 text-ink" : "border-black/15 hover:border-ink",
                    !vStock && "opacity-40 line-through cursor-not-allowed"
                  )}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* quantity + primary actions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center border border-black/15 rounded-[3px] h-12">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} className="grid place-items-center w-11 h-full text-ink disabled:text-black/25" aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-mono text-sm">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(stock || 99, q + 1))} disabled={qty >= stock} className="grid place-items-center w-11 h-full text-ink disabled:text-black/25" aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={add}
            disabled={!inStock}
            className={cn(
              "flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-[3px] font-semibold transition-colors",
              inStock ? "bg-ink text-paper hover:bg-accent hover:text-ink" : "bg-mist text-slate cursor-not-allowed"
            )}
          >
            {added ? <><Check size={18} /> Added</> : <><ShoppingBag size={18} /> Add to cart</>}
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={buyNow} disabled={!inStock} className="flex-1 btn-accent h-12 disabled:bg-mist disabled:text-slate disabled:cursor-not-allowed">
            <Zap size={17} /> Buy now
          </button>
          <button
            onClick={() => toggle(product.id)}
            aria-pressed={saved}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className="grid place-items-center w-12 h-12 rounded-[3px] border border-black/15 hover:border-accent transition-colors"
          >
            <Heart size={18} className={cn(saved && "fill-accent text-accent")} />
          </button>
          <button
            onClick={() => toggleCompare(product.id)}
            disabled={!inCompare(product.id) && isFull}
            aria-pressed={inCompare(product.id)}
            aria-label={inCompare(product.id) ? "Remove from comparison" : "Add to comparison"}
            title={!inCompare(product.id) && isFull ? "Compare list is full (4 max)" : "Compare"}
            className="grid place-items-center w-12 h-12 rounded-[3px] border border-black/15 hover:border-accent transition-colors disabled:opacity-40"
          >
            <GitCompare size={18} className={cn(inCompare(product.id) && "text-accent")} />
          </button>
        </div>

        <a
          href={whatsappLink(askMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-11 rounded-[3px] border border-black/15 text-sm font-medium hover:border-[#25D366] hover:text-[#128C4B] transition-colors"
        >
          <MessageCircle size={16} /> Ask about this product
        </a>
      </div>

      {/* sticky mobile purchase bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-paper/95 backdrop-blur border-t border-black/10 px-4 py-3 flex items-center gap-3">
        <div className="min-w-0">
          <p className="font-mono font-medium text-sm truncate">{formatNaira(unitPrice)}</p>
          <p className="eyebrow text-[0.6rem] text-slate">{inStock ? "In stock" : "Out of stock"}</p>
        </div>
        <button onClick={add} disabled={!inStock} className={cn("flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-[3px] font-semibold", inStock ? "bg-accent text-ink" : "bg-mist text-slate")}>
          {added ? <><Check size={17} /> Added</> : <><ShoppingBag size={17} /> Add to cart</>}
        </button>
      </div>
    </div>
  );
}
