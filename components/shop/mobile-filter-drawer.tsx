"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/types/database";
import type { ProductFilters } from "@/lib/filters";
import { FilterSidebar } from "./filter-sidebar";

export function MobileFilterDrawer({
  filters,
  facets,
  categories,
  count,
}: {
  filters: ProductFilters;
  facets: { brands: string[]; priceMin: number; priceMax: number };
  categories?: Category[];
  count: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 h-[38px] px-3 border border-black/15 rounded-[3px] text-sm font-medium"
      >
        <SlidersHorizontal size={16} /> Filters
        {count > 0 && (
          <span className="grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-ink text-[0.65rem] font-mono font-semibold">
            {count}
          </span>
        )}
      </button>

      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute left-0 top-0 h-full w-[85%] max-w-sm bg-paper flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 h-14 border-b border-black/10">
            <span className="font-display font-semibold">Filters</span>
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="p-2 text-ink hover:text-accent-press">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterSidebar key={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}`} filters={filters} facets={facets} categories={categories} />
          </div>
          <div className="p-4 border-t border-black/10">
            <button onClick={() => setOpen(false)} className="btn-accent w-full">Show results</button>
          </div>
        </div>
      </div>
    </>
  );
}
