"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { navLinks } from "@/lib/site";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition ${open ? "visible" : "invisible"}`}
      aria-hidden={!open}
    >
      {/* scrim */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* panel */}
      <nav
        className={`absolute right-0 top-0 h-full w-[82%] max-w-sm bg-charcoal border-l border-graphite
        flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Main"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-graphite">
          <span className="eyebrow text-accent">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="p-2 text-mist hover:text-accent">
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col py-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-5 py-3.5 text-mist text-[1.05rem] font-medium border-b border-graphite/60 hover:text-accent hover:bg-ink/40"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-5 border-t border-graphite">
          <Link href="/account" onClick={onClose} className="btn-ghost w-full">
            Sign in / Account
          </Link>
        </div>
      </nav>
    </div>
  );
}
