"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { navLinks } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { useCart } from "@/components/cart/cart-context";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { count, setOpen: setCartOpen } = useCart();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  const iconBtn =
    "relative grid place-items-center h-10 w-10 rounded-[3px] text-mist hover:text-accent transition-colors";

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80 border-b border-graphite">
      <div className="container-screen flex items-center gap-4 h-16">
        {/* left: menu (mobile) + logo */}
        <button
          onClick={() => setMenuOpen(true)}
          className={`${iconBtn} lg:hidden -ml-2`}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <Logo />

        {/* center: primary nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-[3px] transition-colors hover:text-accent
                ${link.label === "Deals" ? "text-accent" : "text-mist/90"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* right: actions */}
        <div className="flex items-center gap-0.5 ml-auto lg:ml-0">
          <button onClick={() => setSearchOpen((v) => !v)} className={iconBtn} aria-label="Search">
            <Search size={20} />
          </button>
          <Link href="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Account">
            <User size={20} />
          </Link>
          <Link href="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <button onClick={() => setCartOpen(true)} className={iconBtn} aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-ink text-[0.65rem] font-mono font-semibold">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* search drawer */}
      {searchOpen && (
        <div className="border-t border-graphite bg-ink">
          <form onSubmit={submitSearch} className="container-screen py-3 flex items-center gap-3">
            <Search size={18} className="text-slate" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cameras, lenses, brands, SKU…"
              className="flex-1 bg-transparent text-mist placeholder:text-slate outline-none py-1.5 font-mono text-sm"
            />
            <button type="submit" className="eyebrow text-accent">Search</button>
          </form>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
