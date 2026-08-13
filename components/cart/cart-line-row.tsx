"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ImageOff, Clock } from "lucide-react";
import type { CartLine } from "@/types/database";
import { formatNaira } from "@/lib/format";
import { useCart } from "./cart-context";

export function CartLineRow({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { updateQty, removeItem, saveForLater } = useCart();
  return (
    <div className="flex gap-3 py-4">
      <Link href={`/product/${line.slug}`} className="relative w-20 h-20 shrink-0 bg-mist rounded-[3px] overflow-hidden">
        {line.image ? (
          <Image src={line.image} alt={line.name} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-slate/40"><ImageOff size={20} /></span>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${line.slug}`} className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent-press">
          {line.name}
        </Link>
        <p className="font-mono text-sm text-ink mt-1">{formatNaira(line.price)}</p>

        <div className="flex items-center gap-3 mt-2">
          <div className="inline-flex items-center border border-black/15 rounded-[3px]">
            <button onClick={() => updateQty(line.productId, line.variantId, line.quantity - 1)} className="grid place-items-center w-8 h-8 text-ink disabled:text-black/25" disabled={line.quantity <= 1} aria-label="Decrease">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-mono text-xs">{line.quantity}</span>
            <button onClick={() => updateQty(line.productId, line.variantId, line.quantity + 1)} className="grid place-items-center w-8 h-8 text-ink disabled:text-black/25" disabled={line.quantity >= line.maxStock} aria-label="Increase">
              <Plus size={14} />
            </button>
          </div>

          {!compact && (
            <button onClick={() => saveForLater(line.productId, line.variantId)} className="inline-flex items-center gap-1 text-xs text-slate hover:text-accent-press">
              <Clock size={13} /> Save for later
            </button>
          )}
          <button onClick={() => removeItem(line.productId, line.variantId)} className="inline-flex items-center gap-1 text-xs text-slate hover:text-red-600" aria-label="Remove item">
            <Trash2 size={13} /> {!compact && "Remove"}
          </button>
        </div>
      </div>

      <div className="font-mono text-sm text-ink whitespace-nowrap">{formatNaira(line.price * line.quantity)}</div>
    </div>
  );
}
