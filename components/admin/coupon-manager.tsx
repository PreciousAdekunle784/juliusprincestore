"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Coupon } from "@/types/database";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/app/admin/actions";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";

const field = "border border-black/15 rounded-[3px] px-3 py-2 text-sm outline-none focus:border-accent bg-paper";

export function CouponManager({ initial }: { initial: Coupon[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ code: "", discount_type: "percentage", discount_value: "", expiry_date: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.code.trim() || !form.discount_value) return;
    setSaving(true);
    const res = await createCoupon({
      code: form.code,
      discount_type: form.discount_type as "percentage" | "fixed",
      discount_value: Number(form.discount_value),
      active: true,
      expiry_date: form.expiry_date || null,
    });
    setSaving(false);
    if (res?.error) { setError(res.error); return; }
    setForm({ code: "", discount_type: "percentage", discount_value: "", expiry_date: "" });
    router.refresh();
  }

  async function toggle(id: string, active: boolean) { await toggleCoupon(id, active); router.refresh(); }
  async function remove(id: string) { if (confirm("Delete this coupon?")) { await deleteCoupon(id); router.refresh(); } }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="bg-paper border border-black/[0.07] rounded-[5px] p-5 grid sm:grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-end">
        <label className="block">
          <span className="eyebrow text-slate">Code</span>
          <input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="SAVE10" className={cn(field, "font-mono w-full mt-1")} />
        </label>
        <label className="block">
          <span className="eyebrow text-slate">Type</span>
          <select value={form.discount_type} onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value }))} className={`${field} mt-1`}>
            <option value="percentage">%</option>
            <option value="fixed">₦</option>
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-slate">Value</span>
          <input value={form.discount_value} onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))} inputMode="numeric" className={cn(field, "font-mono w-24 mt-1")} />
        </label>
        <label className="block">
          <span className="eyebrow text-slate">Expires</span>
          <input type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))} className={`${field} mt-1`} />
        </label>
        <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={15} /> Add</>}</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {initial.length === 0 ? (
        <p className="text-sm text-slate bg-paper border border-black/[0.07] rounded-[5px] p-6">No coupons yet.</p>
      ) : (
        <div className="bg-paper border border-black/[0.07] rounded-[5px] divide-y divide-black/[0.06]">
          {initial.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-mono font-medium text-sm">{c.code}</p>
                <p className="text-xs text-slate">
                  {c.discount_type === "percentage" ? `${c.discount_value}% off` : `${formatNaira(c.discount_value)} off`}
                  {c.expiry_date ? ` · expires ${new Date(c.expiry_date).toLocaleDateString("en-NG")}` : ""}
                </p>
              </div>
              <button onClick={() => toggle(c.id, !c.active)} role="switch" aria-checked={c.active} className={`relative h-5 w-9 rounded-full transition-colors ${c.active ? "bg-accent" : "bg-black/20"}`} title={c.active ? "Active" : "Inactive"}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${c.active ? "left-4" : "left-0.5"}`} />
              </button>
              <button onClick={() => remove(c.id)} className="text-slate hover:text-red-600" aria-label="Delete coupon"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
