"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import type { Category, Product } from "@/types/database";
import type { ProductInput } from "@/types/admin";
import { createProduct, updateProduct, deleteProduct } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const field = "w-full border border-black/15 rounded-[3px] px-3 py-2 text-sm outline-none focus:border-accent bg-paper";
const label = "block eyebrow text-slate mb-1";

export function ProductForm({
  categories,
  initial,
  productId,
}: {
  categories: Category[];
  initial?: Product;
  productId?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [salePrice, setSalePrice] = useState(initial?.sale_price != null ? String(initial.sale_price) : "");
  const [stock, setStock] = useState(String(initial?.stock_quantity ?? ""));
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [images, setImages] = useState<string[]>(initial?.images?.length ? initial.images : [""]);
  const [specs, setSpecs] = useState<{ k: string; v: string }[]>(
    initial?.specifications ? Object.entries(initial.specifications).map(([k, v]) => ({ k, v })) : [{ k: "", v: "" }]
  );
  const [flags, setFlags] = useState({
    featured: initial?.featured ?? false,
    best_seller: initial?.best_seller ?? false,
    new_arrival: initial?.new_arrival ?? false,
    on_sale: initial?.on_sale ?? false,
    active: initial?.active ?? true,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function onName(v: string) {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const input: ProductInput = {
      name, slug: slug || slugify(name), description, brand, sku,
      price: Number(price) || 0,
      sale_price: salePrice ? Number(salePrice) : null,
      stock_quantity: Number(stock) || 0,
      category_id: categoryId || null,
      images: images.map((i) => i.trim()).filter(Boolean),
      specifications: Object.fromEntries(specs.filter((s) => s.k.trim()).map((s) => [s.k.trim(), s.v.trim()])),
      ...flags,
    };
    const res = productId ? await updateProduct(productId, input) : await createProduct(input);
    if (res?.error) { setError(res.error); setSaving(false); return; }
    router.push("/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!productId || !confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    await deleteProduct(productId);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-3xl">
      <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5 space-y-4">
        <div><label className={label}>Name</label><input required value={name} onChange={(e) => onName(e.target.value)} className={field} /></div>
        <div>
          <label className={label}>Slug</label>
          <input required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={cn(field, "font-mono")} />
        </div>
        <div><label className={label}>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={field} /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={label}>Brand</label><input value={brand} onChange={(e) => setBrand(e.target.value)} className={field} /></div>
          <div><label className={label}>SKU</label><input value={sku} onChange={(e) => setSku(e.target.value)} className={cn(field, "font-mono")} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><label className={label}>Price (₦)</label><input required inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className={cn(field, "font-mono")} /></div>
          <div><label className={label}>Sale price (₦)</label><input inputMode="numeric" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className={cn(field, "font-mono")} /></div>
          <div><label className={label}>Stock</label><input required inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} className={cn(field, "font-mono")} /></div>
        </div>
        <div>
          <label className={label}>Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={field}>
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* images */}
      <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
        <p className="font-display font-semibold mb-3">Images</p>
        <p className="text-xs text-slate mb-3">Paste image URLs (e.g. from Supabase Storage). First image is the main image.</p>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input value={img} onChange={(e) => setImages((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))} placeholder="https://…" className={cn(field, "font-mono text-xs")} />
              <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className="grid place-items-center w-9 border border-black/15 rounded-[3px] text-slate hover:text-red-600" aria-label="Remove image"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setImages((prev) => [...prev, ""])} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-press"><Plus size={15} /> Add image URL</button>
      </div>

      {/* specifications */}
      <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
        <p className="font-display font-semibold mb-3">Specifications</p>
        <div className="space-y-2">
          {specs.map((sp, i) => (
            <div key={i} className="flex gap-2">
              <input value={sp.k} onChange={(e) => setSpecs((prev) => prev.map((x, j) => (j === i ? { ...x, k: e.target.value } : x)))} placeholder="Label (e.g. Sensor)" className={field} />
              <input value={sp.v} onChange={(e) => setSpecs((prev) => prev.map((x, j) => (j === i ? { ...x, v: e.target.value } : x)))} placeholder="Value (e.g. Full-frame)" className={field} />
              <button type="button" onClick={() => setSpecs((prev) => prev.filter((_, j) => j !== i))} className="grid place-items-center w-9 shrink-0 border border-black/15 rounded-[3px] text-slate hover:text-red-600" aria-label="Remove spec"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setSpecs((prev) => [...prev, { k: "", v: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent-press"><Plus size={15} /> Add specification</button>
      </div>

      {/* flags */}
      <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
        <p className="font-display font-semibold mb-3">Visibility & tags</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {([
            ["active", "Active (visible in store)"],
            ["featured", "Featured"],
            ["best_seller", "Best seller"],
            ["new_arrival", "New arrival"],
            ["on_sale", "On sale"],
          ] as const).map(([key, lbl]) => (
            <label key={key} className="flex items-center gap-2.5 text-sm cursor-pointer">
              <input type="checkbox" checked={flags[key]} onChange={(e) => setFlags((f) => ({ ...f, [key]: e.target.checked }))} className="accent-[color:var(--accent)] h-4 w-4" />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> {productId ? "Save changes" : "Create product"}</>}
        </button>
        {productId && (
          <button type="button" onClick={onDelete} disabled={deleting} className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline ml-auto">
            <Trash2 size={15} /> Delete
          </button>
        )}
      </div>
    </form>
  );
}
