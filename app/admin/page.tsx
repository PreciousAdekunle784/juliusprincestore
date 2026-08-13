import Link from "next/link";
import { Package, ShoppingCart, Users, Clock, ArrowRight } from "lucide-react";
import { getDashboardStats, getAdminOrders } from "@/lib/admin";
import { formatNaira } from "@/lib/format";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/account/order-status";

export default async function AdminDashboard() {
  const [stats, orders] = await Promise.all([getDashboardStats(), getAdminOrders()]);
  const recent = orders.slice(0, 6);

  const cards = [
    { label: "Products", value: stats.products, icon: Package, href: "/admin/products" },
    { label: "Orders", value: stats.orders, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Pending", value: stats.pendingOrders, icon: Clock, href: "/admin/orders" },
    { label: "Customers", value: stats.customers, icon: Users, href: "/admin/customers" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="bg-paper border border-black/[0.07] rounded-[5px] p-5 hover:border-accent transition-colors">
            <c.icon size={20} className="text-accent-press mb-3" />
            <p className="font-mono font-medium text-2xl">{c.value}</p>
            <p className="eyebrow text-slate mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-accent-press hover:underline inline-flex items-center gap-1">All <ArrowRight size={14} /></Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate bg-paper border border-black/[0.07] rounded-[5px] p-6">No orders yet.</p>
        ) : (
          <ul className="bg-paper border border-black/[0.07] rounded-[5px] divide-y divide-black/[0.06]">
            {recent.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 p-4 hover:bg-mist/40">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm">#{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-slate mt-0.5 truncate">{o.customer_name} · {new Date(o.created_at).toLocaleDateString("en-NG")}</p>
                  </div>
                  <PaymentStatusBadge status={o.payment_status} />
                  <OrderStatusBadge status={o.order_status} />
                  <span className="font-mono text-sm hidden sm:block">{formatNaira(o.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
