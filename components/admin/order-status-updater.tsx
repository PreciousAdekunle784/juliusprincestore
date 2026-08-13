"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { updateOrder } from "@/app/admin/actions";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const PAYMENTS: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];
const STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const sel = "w-full border border-black/15 rounded-[3px] px-3 py-2 text-sm outline-none focus:border-accent bg-paper capitalize";

export function OrderStatusUpdater({
  id,
  paymentStatus,
  orderStatus,
}: {
  id: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}) {
  const router = useRouter();
  const [pay, setPay] = useState<PaymentStatus>(paymentStatus);
  const [ord, setOrd] = useState<OrderStatus>(orderStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    await updateOrder(id, { payment_status: pay, order_status: ord });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
      <p className="font-display font-semibold mb-4">Update status</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="eyebrow text-slate">Payment</span>
          <select value={pay} onChange={(e) => setPay(e.target.value as PaymentStatus)} className={`${sel} mt-1`}>
            {PAYMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow text-slate">Order</span>
          <select value={ord} onChange={(e) => setOrd(e.target.value as OrderStatus)} className={`${sel} mt-1`}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <button onClick={save} disabled={saving} className="btn-accent disabled:opacity-60">
        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : saved ? <><Check size={16} /> Saved</> : "Save status"}
      </button>
    </div>
  );
}
