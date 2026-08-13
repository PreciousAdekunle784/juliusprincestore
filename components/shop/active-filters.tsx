"use client";

import { X } from "lucide-react";
import type { Category } from "@/types/database";
import type { ProductFilters } from "@/lib/filters";
import { formatNaira } from "@/lib/format";
import { useFilterNav } from "./use-filter-nav";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 bg-ink text-paper text-xs rounded-[3px] pl-2.5 pr-1.5 py-1 hover:bg-accent hover:text-ink transition-colors"
    >
      {label} <X size={13} />
    </button>
  );
}

export function ActiveFilters({
  filters,
  categories,
  showCategory,
}: {
  filters: ProductFilters;
  categories: Category[];
  showCategory: boolean;
}) {
  const { set, clear } = useFilterNav();
  const chips: React.ReactNode[] = [];

  if (filters.q) chips.push(<Chip key="q" label={`“${filters.q}”`} onRemove={() => set({ q: null })} />);
  if (showCategory && filters.category) {
    const name = categories.find((c) => c.slug === filters.category)?.name ?? filters.category;
    chips.push(<Chip key="cat" label={name} onRemove={() => set({ category: null })} />);
  }
  filters.brands.forEach((b) =>
    chips.push(
      <Chip key={`b-${b}`} label={b} onRemove={() => set({ brand: filters.brands.filter((x) => x !== b).join(",") || null })} />
    )
  );
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const lo = filters.minPrice !== undefined ? formatNaira(filters.minPrice) : "Any";
    const hi = filters.maxPrice !== undefined ? formatNaira(filters.maxPrice) : "Any";
    chips.push(<Chip key="price" label={`${lo} – ${hi}`} onRemove={() => set({ min: null, max: null })} />);
  }
  if (filters.inStock) chips.push(<Chip key="stock" label="In stock" onRemove={() => set({ stock: null })} />);
  if (filters.minRating) chips.push(<Chip key="rating" label={`${filters.minRating}★ & up`} onRemove={() => set({ rating: null })} />);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {chips}
      {chips.length > 1 && (
        <button onClick={clear} className="text-xs text-slate hover:text-accent-press underline underline-offset-2 ml-1">
          Clear all
        </button>
      )}
    </div>
  );
}
