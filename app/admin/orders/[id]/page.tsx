import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminOrder } from "@/lib/admin";
import { formatNaira } from "@/lib/format";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const order = await getAdminOrder(params.id);
  if (!order) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink"><ArrowLeft size={15} /> Orders</Link>
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h1>

      <OrderStatusUpdater id={order.id} paymentStatus={order.payment_status} orderStatus={order.order_status} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
          <p className="eyebrow text-accent-press mb-3">Customer</p>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm text-slate">{order.customer_email}</p>
          <p className="text-sm text-slate">{order.customer_phone}</p>
          <p className="text-sm text-slate mt-2">{order.delivery_address}</p>
          <p className="text-sm text-slate">{order.state} · {order.delivery_method}</p>
          {order.payment_method && <p className="eyebrow text-slate mt-2">Paid via {order.payment_method}</p>}
        </div>
        <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
          <p className="eyebrow text-accent-press mb-3">Summary</p>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd className="font-mono">{formatNaira(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate">Delivery</dt><dd className="font-mono">{formatNaira(order.delivery_fee)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-accent-press"><dt>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</dt><dd className="font-mono">−{formatNaira(order.discount)}</dd></div>}
            <div className="flex justify-between font-semibold border-t border-black/[0.08] pt-1.5 mt-1.5"><dt>Total</dt><dd className="font-mono">{formatNaira(order.total)}</dd></div>
          </dl>
        </div>
      </div>

      <div className="bg-paper border border-black/[0.07] rounded-[5px] p-5">
        <p className="eyebrow text-accent-press mb-3">Items</p>
        <ul className="divide-y divide-black/[0.06]">
          {(order.items ?? []).map((it) => (
            <li key={it.id} className="flex justify-between gap-4 py-2.5 text-sm">
              <span>{it.quantity} × {it.product_name}</span>
              <span className="font-mono">{formatNaira(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
