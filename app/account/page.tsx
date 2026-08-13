import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { getProfile } from "@/lib/auth";
import { getUserOrders } from "@/lib/queries";
import { formatNaira } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status";

export const metadata = { title: "Account" };

export default async function AccountOverview() {
  const [profile, orders] = await Promise.all([getProfile(), getUserOrders(3)]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-xl">
          Hello{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h2>
        <p className="text-sm text-slate mt-1">Manage your orders, addresses and details here.</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Recent orders</h3>
          <Link href="/account/orders" className="text-sm text-accent-press hover:underline inline-flex items-center gap-1">
            All orders <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[5px] border border-dashed border-black/15 bg-mist/50 px-6 py-12 text-center">
            <Package size={28} className="mx-auto text-slate/50 mb-2" />
            <p className="text-sm text-slate">No orders yet.</p>
            <Link href="/shop" className="btn-accent mt-4">Start shopping</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`} className="flex items-center justify-between gap-4 border border-black/[0.08] rounded-[5px] p-4 hover:border-accent transition-colors">
                  <div className="min-w-0">
                    <p className="font-mono text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-slate mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })} · {o.items?.length ?? 0} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PaymentStatusBadge status={o.payment_status} />
                    <OrderStatusBadge status={o.order_status} />
                    <span className="font-mono text-sm hidden sm:block">{formatNaira(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
