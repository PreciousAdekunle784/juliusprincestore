"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "./compare-context";

export function CompareTray() {
  const pathname = usePathname();
  const { count, clear } = useCompare();

  const hidden = pathname?.startsWith("/product/") || pathname?.startsWith("/checkout") || pathname?.startsWith("/admin") || pathname === "/compare";
  if (hidden || count === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30">
      <div className="flex items-center gap-3 bg-ink text-paper rounded-full pl-4 pr-2 py-2 shadow-lg shadow-black/25">
        <span className="eyebrow text-[0.6rem] flex items-center gap-1.5"><GitCompare size={14} className="text-accent" /> {count} to compare</span>
        <Link href="/compare" className="bg-accent text-ink text-sm font-semibold rounded-full px-3.5 py-1.5">Compare</Link>
        <button onClick={clear} aria-label="Clear comparison" className="text-mist/70 hover:text-paper p-1"><X size={16} /></button>
      </div>
    </div>
  );
}
