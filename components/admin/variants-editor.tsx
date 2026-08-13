"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { ProductVariant } from "@/types/database";
import { addVariant, deleteVariant } from "@/app/admin/actions";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

const field = "border border-black/15 rounded-[3px] px-3 py-2 text-sm outline-none focus:border-accent bg-paper";

export function VariantsEditor({ productId, variants }: { productId: string; variants: ProductVariant[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock_quantity: "" });
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await addVariant(productId, {
      name: form.name, sku: form.sku || null,
      price: form.price ? Number(form.price) : null,
      stock_quantity: Number(form.stock_quantity) || 0,
    });
    setForm({ name: "", sku: "", price: "", stock_quantity: "" });
    setSaving(false);
    router.refresh();
  }

  async function remove(id: string) {
    await deleteVariant(id, productId);
    router.refresh();
  }

  return (
    <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5 max-w-3xl">
      <p className="font-display font-semibold mb-1">Variants</p>
      <p className="text-xs text-slate mb-4">Options like kit vs body-only, colour or capacity. A variant price overrides the base price; leave blank to inherit it.</p>

      {variants.length > 0 && (
        <ul className="divide-y divide-black/[0.06] mb-4 border-y border-black/[0.06]">
          {variants.map((v) => (
            <li key={v.id} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="flex-1 font-medium">{v.name}</span>
              {v.sku && <span className="font-mono text-xs text-slate">{v.sku}</span>}
              <span className="font-mono text-xs">{v.price != null ? formatNaira(v.price) : "base"}</span>
              <span className="font-mono text-xs text-slate">{v.stock_quantity} in stock</span>
              <button onClick={() => remove(v.id)} className="text-slate hover:text-red-600" aria-label="Remove variant"><Trash2 size={15} /></button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={add} className="grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className={field} />
        <input value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} placeholder="SKU" className={cn(field, "font-mono w-28")} />
        <input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="Price" inputMode="numeric" className={cn(field, "font-mono w-24")} />
        <input value={form.stock_quantity} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))} placeholder="Stock" inputMode="numeric" className={cn(field, "font-mono w-20")} />
        <button type="submit" disabled={saving} className="btn-accent !py-2 disabled:opacity-60">{saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}</button>
      </form>
    </div>
  );
}
