import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserOrder } from "@/lib/queries";
import { formatNaira } from "@/lib/format";
import { StatusTimeline, PaymentStatusBadge } from "@/components/account/order-status";

export const metadata = { title: "Order", robots: { index: false } };

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const order = await getUserOrder(params.id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <Link href="/account/orders" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-accent-press">
        <ArrowLeft size={15} /> All orders
      </Link>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-xl">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
          <p className="text-xs text-slate mt-1">
            Placed {new Date(order.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <PaymentStatusBadge status={order.payment_status} />
      </div>

      {order.payment_status === "paid" && (
        <div className="bg-mist rounded-[6px] p-6 overflow-x-auto">
          <StatusTimeline status={order.order_status} />
        </div>
      )}

      <section>
        <h3 className="eyebrow text-accent-press mb-3">Items</h3>
        <ul className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {(order.items ?? []).map((it) => (
            <li key={it.id} className="flex justify-between gap-4 py-3 text-sm">
              <span>{it.quantity} × {it.product_name}</span>
              <span className="font-mono">{formatNaira(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid sm:grid-cols-2 gap-6">
        <section>
          <h3 className="eyebrow text-accent-press mb-3">Delivery</h3>
          <p className="text-sm text-ink">{order.customer_name}</p>
          <p className="text-sm text-slate">{order.delivery_address}</p>
          <p className="text-sm text-slate">{order.state}</p>
          <p className="text-sm text-slate mt-1">{order.customer_phone}</p>
        </section>
        <section>
          <h3 className="eyebrow text-accent-press mb-3">Summary</h3>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd className="font-mono">{formatNaira(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Delivery</dt><dd className="font-mono">{formatNaira(order.delivery_fee)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-accent-press"><dt>Discount</dt><dd className="font-mono">−{formatNaira(order.discount)}</dd></div>}
            <div className="flex justify-between font-semibold border-t border-black/[0.08] pt-1.5 mt-1.5"><dt>Total</dt><dd className="font-mono">{formatNaira(order.total)}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
