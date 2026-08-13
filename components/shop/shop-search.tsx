"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useFilterNav } from "./use-filter-nav";

export function ShopSearch({ initial }: { initial: string }) {
  const { set } = useFilterNav();
  const [v, setV] = useState(initial);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); set({ q: v.trim() || null }); }}
      className="flex items-center gap-2 bg-paper border border-black/15 rounded-[3px] px-3 h-[38px] focus-within:border-accent w-full sm:w-64"
    >
      <Search size={16} className="text-slate shrink-0" />
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Search this store…"
        className="flex-1 bg-transparent text-sm outline-none min-w-0 font-mono"
      />
      {v && (
        <button type="button" onClick={() => { setV(""); set({ q: null }); }} aria-label="Clear search" className="text-slate hover:text-ink">
          <X size={15} />
        </button>
      )}
    </form>
  );
}
