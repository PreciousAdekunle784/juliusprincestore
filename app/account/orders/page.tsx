import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { getUserOrders } from "@/lib/queries";
import { formatNaira } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-5">Your orders</h2>
      {orders.length === 0 ? (
        <div className="rounded-[5px] border border-dashed border-black/15 bg-mist/50 px-6 py-16 text-center">
          <Package size={30} className="mx-auto text-slate/50 mb-2" />
          <p className="text-sm text-slate">You haven’t placed any orders yet.</p>
          <Link href="/shop" className="btn-accent mt-4">Browse the store</Link>
        </div>
      ) : (
        <ul className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`} className="flex items-center gap-4 py-4 hover:bg-mist/40 px-2 -mx-2 rounded transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <PaymentStatusBadge status={o.payment_status} />
                    <OrderStatusBadge status={o.order_status} />
                  </div>
                  <p className="text-xs text-slate mt-1">
                    {new Date(o.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })} · {o.items?.length ?? 0} item(s)
                  </p>
                </div>
                <span className="font-mono text-sm">{formatNaira(o.total)}</span>
                <ChevronRight size={16} className="text-slate" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
