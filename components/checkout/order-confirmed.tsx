import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/format";
import { site } from "@/lib/site";
import { ClearCart } from "@/components/cart/clear-cart";

export function OrderConfirmed({
  orderId,
  total,
  paid,
  bank = false,
}: {
  orderId: string;
  total: number;
  paid: boolean;
  bank?: boolean;
}) {
  return (
    <section className="container-screen py-16 md:py-24 max-w-xl">
      <ClearCart />
      <div className="text-center">
        <span className={`mx-auto grid place-items-center h-16 w-16 rounded-full ${paid ? "bg-accent/15 text-accent-press" : "bg-mist text-slate"}`}>
          {paid ? <CheckCircle2 size={32} /> : <Clock size={30} />}
        </span>
        <h1 className="font-display font-extrabold text-3xl tracking-tight mt-6">
          {paid ? "Order confirmed" : "Order received"}
        </h1>
        <p className="mt-3 text-slate">
          {paid
            ? "Payment received — we’ll start processing your order right away."
            : "Your order is placed. It’s confirmed once we verify your payment."}
        </p>

        <div className="mt-8 bg-mist rounded-[6px] p-6 text-left">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate">Order reference</span>
            <span className="font-mono">#{orderId.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate">Total</span>
            <span className="font-mono font-medium">{formatNaira(total)}</span>
          </div>

          {bank && (
            <div className="mt-5 pt-5 border-t border-black/[0.08]">
              <p className="eyebrow text-accent-press mb-3">Transfer to</p>
              <dl className="space-y-1.5 text-sm font-mono">
                <div className="flex justify-between"><dt className="text-slate">Bank</dt><dd>{site.bank.name}</dd></div>
                <div className="flex justify-between"><dt className="text-slate">Account name</dt><dd>{site.bank.accountName}</dd></div>
                <div className="flex justify-between"><dt className="text-slate">Account number</dt><dd>{site.bank.accountNumber}</dd></div>
              </dl>
              <p className="text-xs text-slate mt-3">
                Use your order reference as the transfer narration, then send proof on WhatsApp. We’ll confirm and begin processing.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="btn-accent">Continue shopping <ArrowRight size={16} /></Link>
          <Link href="/account" className="btn-ghost !text-ink !border-black/20 hover:!border-accent">View my orders</Link>
        </div>
      </div>
    </section>
  );
}
