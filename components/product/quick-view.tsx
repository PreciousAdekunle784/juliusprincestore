"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ImageOff, ArrowRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/database";
import { Price } from "@/components/product/price";

export function QuickView({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const img = product.images?.[0];
  const specs = product.specifications ? Object.entries(product.specifications).slice(0, 5) : [];
  const inStock = product.stock_quantity > 0;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl bg-paper rounded-[6px] overflow-hidden grid md:grid-cols-2 animate-rise">
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 grid place-items-center h-9 w-9 rounded-full bg-paper/90 text-ink hover:text-accent-press shadow"
        >
          <X size={18} />
        </button>

        <div className="relative aspect-square bg-mist">
          {img ? (
            <Image src={img} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-slate/50"><ImageOff size={32} /></span>
          )}
        </div>

        <div className="flex flex-col gap-3 p-6">
          {product.brand && <span className="eyebrow text-slate">{product.brand}</span>}
          <h2 className="font-display font-bold text-xl leading-tight">{product.name}</h2>
          <Price price={product.price} salePrice={product.sale_price} size="lg" />
          <p className="eyebrow text-[0.65rem]" style={{ color: inStock ? "var(--accent-press)" : "var(--slate)" }}>
            {inStock ? `In stock · ${product.stock_quantity} available` : "Out of stock"}
          </p>

          {specs.length > 0 && (
            <dl className="mt-1 border-t border-black/[0.08] divide-y divide-black/[0.06]">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5">
                  <dt className="font-mono text-[0.7rem] text-slate uppercase tracking-wide">{k}</dt>
                  <dd className="font-mono text-[0.75rem] text-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-3">
            <button
              onClick={() => { onAdd(); onClose(); }}
              disabled={!inStock}
              className="btn-accent w-full disabled:bg-mist disabled:text-slate disabled:cursor-not-allowed"
            >
              <ShoppingBag size={17} /> Add to cart
            </button>
            <Link href={`/product/${product.slug}`} onClick={onClose} className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-ink hover:text-accent-press">
              Full details <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
