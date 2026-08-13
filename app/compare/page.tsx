"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GitCompare, X, ImageOff, ShoppingBag, Loader2 } from "lucide-react";
import { useCompare } from "@/components/compare/compare-context";
import { useCart } from "@/components/cart/cart-context";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/format";
import type { Product } from "@/types/database";

export default function ComparePage() {
  const { ids, remove, clear } = useCompare();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      if (ids.length === 0) { if (active) { setProducts([]); setLoading(false); } return; }
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*, category:categories(*)").in("id", ids).eq("active", true);
      if (active) {
        // preserve the order the user added them in
        const map = new Map(((data as Product[] | null) ?? []).map((p) => [p.id, p]));
        setProducts(ids.map((id) => map.get(id)).filter(Boolean) as Product[]);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [ids]);

  // union of all specification keys, preserving first-seen order
  const specKeys: string[] = [];
  for (const p of products) {
    for (const k of Object.keys(p.specifications ?? {})) {
      if (!specKeys.includes(k)) specKeys.push(k);
    }
  }

  const add = (p: Product) =>
    addItem({
      productId: p.id, slug: p.slug, name: p.name,
      price: p.sale_price ?? p.price, image: p.images?.[0] ?? null,
      maxStock: p.stock_quantity,
    });

  return (
    <div className="container-screen py-10 md:py-14">
      <div className="flex items-center justify-between gap-3 mb-8">
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">Compare</h1>
        {products.length > 0 && (
          <button onClick={clear} className="text-sm text-slate hover:text-red-600 inline-flex items-center gap-1.5">
            <X size={15} /> Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 grid place-items-center"><Loader2 className="animate-spin text-slate" /></div>
      ) : products.length === 0 ? (
        <div className="rounded-[6px] border border-dashed border-black/15 bg-mist/50 px-6 py-20 text-center">
          <GitCompare size={32} className="mx-auto text-slate/50 mb-3" />
          <p className="font-medium">Nothing to compare yet</p>
          <p className="text-sm text-slate mt-1 mb-6">Add up to 4 products using the compare icon, then see them side by side here.</p>
          <Link href="/shop" className="btn-accent">Browse the store</Link>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="w-36 align-bottom text-left p-3" />
                {products.map((p) => (
                  <th key={p.id} className="p-3 align-top text-left min-w-[180px]">
                    <div className="relative aspect-square bg-mist rounded-[4px] overflow-hidden mb-3">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill sizes="200px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center text-slate/40"><ImageOff size={22} /></span>
                      )}
                      <button onClick={() => remove(p.id)} aria-label="Remove" className="absolute right-1.5 top-1.5 grid place-items-center h-7 w-7 rounded-full bg-paper/90 text-ink hover:text-red-600 shadow-sm">
                        <X size={15} />
                      </button>
                    </div>
                    <Link href={`/product/${p.slug}`} className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent-press">{p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top">
              <CompareRow label="Price">
                {products.map((p) => (
                  <Cell key={p.id}><span className="font-mono font-medium">{formatNaira(p.sale_price ?? p.price)}</span></Cell>
                ))}
              </CompareRow>
              <CompareRow label="Brand">
                {products.map((p) => <Cell key={p.id}>{p.brand ?? "—"}</Cell>)}
              </CompareRow>
              <CompareRow label="Availability">
                {products.map((p) => (
                  <Cell key={p.id}>
                    {p.stock_quantity > 0 ? <span className="text-green-700">In stock</span> : <span className="text-red-600">Out of stock</span>}
                  </Cell>
                ))}
              </CompareRow>
              {specKeys.map((key) => (
                <CompareRow key={key} label={key}>
                  {products.map((p) => <Cell key={p.id}>{p.specifications?.[key] ?? "—"}</Cell>)}
                </CompareRow>
              ))}
              <tr>
                <td className="p-3" />
                {products.map((p) => (
                  <td key={p.id} className="p-3">
                    <button onClick={() => add(p)} disabled={p.stock_quantity <= 0} className="btn-accent w-full !text-xs disabled:bg-mist disabled:text-slate disabled:cursor-not-allowed">
                      <ShoppingBag size={14} /> Add to cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-black/[0.07]">
      <th scope="row" className="p-3 text-left eyebrow text-slate whitespace-nowrap align-top">{label}</th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="p-3 text-sm">{children}</td>;
}
