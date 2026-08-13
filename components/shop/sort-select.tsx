"use client";

import { SORT_OPTIONS, type SortKey } from "@/lib/filters";
import { useFilterNav } from "./use-filter-nav";

export function SortSelect({ value }: { value: SortKey }) {
  const { set } = useFilterNav();
  return (
    <label className="flex items-center gap-2">
      <span className="eyebrow text-slate hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(e) => set({ sort: e.target.value })}
        className="bg-paper border border-black/15 rounded-[3px] text-sm py-2 pl-3 pr-8 font-medium focus:border-accent outline-none"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
