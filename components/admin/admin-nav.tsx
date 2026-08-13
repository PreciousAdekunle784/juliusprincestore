"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Ticket, Store } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
      {links.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[3px] text-sm font-medium whitespace-nowrap transition-colors ${
              active ? "bg-accent text-ink" : "text-mist/80 hover:bg-graphite hover:text-paper"
            }`}
          >
            <l.icon size={16} /> {l.label}
          </Link>
        );
      })}
      <div className="hidden lg:block h-px bg-graphite my-2" />
      <Link href="/" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[3px] text-sm text-mist/60 hover:text-paper">
        <Store size={16} /> View store
      </Link>
    </nav>
  );
}
