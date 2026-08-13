import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff, Search } from "lucide-react";
import { getAdminProducts } from "@/lib/admin";
import { formatNaira } from "@/lib/format";
import { ProductRowActions } from "@/components/admin/product-row-actions";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminProducts({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const q = first(searchParams.q) ?? "";
  const products = await getAdminProducts(q);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display font-extrabold text-2xl tracking-tight">Products</h1>
        <Link href="/admin/products/new" className="btn-accent"><Plus size={16} /> Add product</Link>
      </div>

      <form className="flex items-center gap-2 bg-paper border border-black/15 rounded-[3px] px-3 h-10 max-w-sm">
        <Search size={16} className="text-slate" />
        <input name="q" defaultValue={q} placeholder="Search products…" className="flex-1 bg-transparent text-sm outline-none" />
      </form>

      {products.length === 0 ? (
        <div className="bg-paper border border-black/[0.07] rounded-[5px] px-6 py-16 text-center">
          <p className="text-sm text-slate">{q ? "No products match." : "No products yet — add your first one."}</p>
        </div>
      ) : (
        <div className="bg-paper border border-black/[0.07] rounded-[5px] overflow-hidden">
          <div className="divide-y divide-black/[0.06]">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3.5">
                <div className="relative w-12 h-12 bg-mist rounded-[3px] overflow-hidden shrink-0">
                  {p.images?.[0] ? <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" /> : <span className="absolute inset-0 grid place-items-center text-slate/40"><ImageOff size={16} /></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-slate">{p.category?.name ?? "—"} · {formatNaira(p.sale_price ?? p.price)} · {p.stock_quantity} in stock</p>
                </div>
                <ProductRowActions id={p.id} active={p.active} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
