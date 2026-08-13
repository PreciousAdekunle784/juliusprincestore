import Link from "next/link";
import { getAdminOrders } from "@/lib/admin";
import { formatNaira } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status";

export default async function AdminOrders() {
  const orders = await getAdminOrders();
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-slate bg-paper border border-black/[0.07] rounded-[5px] p-6">No orders yet.</p>
      ) : (
        <div className="bg-paper border border-black/[0.07] rounded-[5px] divide-y divide-black/[0.06]">
          {orders.map((o) => (
            <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center gap-3 p-4 hover:bg-mist/40">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-slate mt-0.5 truncate">{o.customer_name} · {o.customer_phone} · {new Date(o.created_at).toLocaleDateString("en-NG")}</p>
              </div>
              <PaymentStatusBadge status={o.payment_status} />
              <OrderStatusBadge status={o.order_status} />
              <span className="font-mono text-sm hidden sm:block">{formatNaira(o.total)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
