"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

const links = [
  { href: "/account", label: "Overview", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/profile", label: "Profile", icon: User },
];

export function AccountNav() {
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
              active ? "bg-ink text-paper" : "text-slate hover:bg-mist hover:text-ink"
            }`}
          >
            <l.icon size={16} /> {l.label}
          </Link>
        );
      })}
      <div className="hidden lg:block h-px bg-black/10 my-2" />
      <SignOutButton className="px-3.5 py-2.5 rounded-[3px] text-slate hover:text-red-600 justify-start" />
    </nav>
  );
}
