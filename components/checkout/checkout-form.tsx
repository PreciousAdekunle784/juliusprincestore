"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, Tag, Loader2, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/format";
import { NIGERIAN_STATES, DELIVERY_METHODS, estimateDelivery } from "@/lib/delivery";
import { cn } from "@/lib/utils";

type PayMethod = "paystack" | "flutterwave" | "bank_transfer";

const PAY_OPTIONS: { id: PayMethod; label: string; note: string; icon: typeof CreditCard }[] = [
  { id: "paystack", label: "Card / Bank — Paystack", note: "Secure hosted checkout", icon: CreditCard },
  { id: "flutterwave", label: "Card / Bank — Flutterwave", note: "Secure hosted checkout", icon: CreditCard },
  { id: "bank_transfer", label: "Direct bank transfer", note: "We confirm once payment is received", icon: Landmark },
];

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", state: "" });
  const [deliveryMethod, setDeliveryMethod] = useState<string>("standard");
  const [payMethod, setPayMethod] = useState<PayMethod>("paystack");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; type: string; value: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const deliveryFee = form.state ? estimateDelivery(form.state, deliveryMethod) : 0;
  const discount = applied
    ? applied.type === "percentage"
      ? Math.round((subtotal * applied.value) / 100)
      : Math.min(applied.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  async function applyCoupon() {
    setCouponMsg(null);
    if (!coupon.trim()) return;
    const supabase = createClient();
    const { data } = await supabase.rpc("validate_coupon", { coupon_code: coupon.trim() });
    const c = Array.isArray(data) ? data[0] : data;
    if (c) {
      setApplied({ code: c.code, type: c.discount_type, value: Number(c.discount_value) });
      setCouponMsg("Coupon applied.");
    } else {
      setApplied(null);
      setCouponMsg("That code isn’t valid.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
          customer: form,
          deliveryMethod,
          couponCode: applied?.code,
          paymentMethod: payMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); setLoading(false); return; }
      if (data.redirect) {
        if (data.redirect.startsWith("http")) window.location.href = data.redirect;
        else router.push(data.redirect);
        return;
      }
      setError("Payment could not be started.");
      setLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-screen py-20 text-center">
        <ShoppingBag size={34} className="mx-auto text-slate/50 mb-3" />
        <p className="font-medium">Your cart is empty</p>
        <Link href="/shop" className="btn-accent mt-5">Browse the store</Link>
      </div>
    );
  }

  const field = "w-full border border-black/15 rounded-[3px] px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <form onSubmit={submit} className="container-screen py-10 md:py-14 grid lg:grid-cols-[1fr_400px] gap-10">
      {/* details */}
      <div className="space-y-8">
        <div>
          <h2 className="eyebrow text-accent-press mb-4">Delivery details</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <input required placeholder="Full name" value={form.name} onChange={set("name")} className={cn(field, "sm:col-span-2")} />
            <input required type="email" placeholder="Email" value={form.email} onChange={set("email")} className={field} />
            <input required placeholder="Phone number" value={form.phone} onChange={set("phone")} className={field} />
            <input required placeholder="Delivery address" value={form.address} onChange={set("address")} className={cn(field, "sm:col-span-2")} />
            <select required value={form.state} onChange={set("state")} className={cn(field, "sm:col-span-2")}>
              <option value="" disabled>Select state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <h2 className="eyebrow text-accent-press mb-4">Delivery method</h2>
          <div className="space-y-2.5">
            {DELIVERY_METHODS.map((m) => (
              <label key={m.id} className={cn("flex items-center gap-3 border rounded-[4px] px-4 py-3 cursor-pointer", deliveryMethod === m.id ? "border-accent bg-accent/[0.06]" : "border-black/15")}>
                <input type="radio" name="delivery" checked={deliveryMethod === m.id} onChange={() => setDeliveryMethod(m.id)} className="accent-[color:var(--accent)]" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="block text-xs text-slate">{m.note}</span>
                </span>
                {form.state && <span className="font-mono text-sm">{formatNaira(estimateDelivery(form.state, m.id))}</span>}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="eyebrow text-accent-press mb-4">Payment</h2>
          <div className="space-y-2.5">
            {PAY_OPTIONS.map((o) => (
              <label key={o.id} className={cn("flex items-center gap-3 border rounded-[4px] px-4 py-3 cursor-pointer", payMethod === o.id ? "border-accent bg-accent/[0.06]" : "border-black/15")}>
                <input type="radio" name="pay" checked={payMethod === o.id} onChange={() => setPayMethod(o.id)} className="accent-[color:var(--accent)]" />
                <o.icon size={18} className="text-slate" />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{o.label}</span>
                  <span className="block text-xs text-slate">{o.note}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-mist rounded-[6px] p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Order summary</h2>

          <div className="divide-y divide-black/[0.06] mb-4 max-h-52 overflow-y-auto">
            {items.map((l) => (
              <div key={`${l.productId}-${l.variantId ?? ""}`} className="flex justify-between gap-3 py-2 text-sm">
                <span className="text-slate line-clamp-1">{l.quantity} × {l.name}</span>
                <span className="font-mono whitespace-nowrap">{formatNaira(l.price * l.quantity)}</span>
              </div>
            ))}
          </div>

          {/* coupon */}
          <div className="flex gap-2 mb-4">
            <div className="flex items-center gap-2 flex-1 border border-black/15 rounded-[3px] px-2.5 bg-paper">
              <Tag size={14} className="text-slate" />
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 bg-transparent py-2 text-sm outline-none font-mono" />
            </div>
            <button type="button" onClick={applyCoupon} className="px-3 bg-ink text-paper text-sm font-medium rounded-[3px] hover:bg-accent hover:text-ink transition-colors">Apply</button>
          </div>
          {couponMsg && <p className={cn("text-xs mb-4 -mt-2", applied ? "text-accent-press" : "text-red-600")}>{couponMsg}</p>}

          <dl className="space-y-2 text-sm border-t border-black/[0.08] pt-4">
            <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd className="font-mono">{formatNaira(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Delivery</dt><dd className="font-mono">{form.state ? formatNaira(deliveryFee) : "—"}</dd></div>
            {discount > 0 && <div className="flex justify-between text-accent-press"><dt>Discount</dt><dd className="font-mono">−{formatNaira(discount)}</dd></div>}
            <div className="flex justify-between text-base font-semibold border-t border-black/[0.08] pt-2 mt-2"><dt>Total</dt><dd className="font-mono">{formatNaira(total)}</dd></div>
          </dl>

          {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

          <button type="submit" disabled={loading} className="btn-accent w-full mt-5 disabled:opacity-60">
            {loading ? <><Loader2 size={17} className="animate-spin" /> Starting…</> : <>Place order · {formatNaira(total)}</>}
          </button>
          <p className="flex items-center justify-center gap-1.5 eyebrow text-[0.6rem] text-slate mt-3">
            <ShieldCheck size={13} /> Payment verified before any order is confirmed
          </p>
        </div>
      </aside>
    </form>
  );
}
