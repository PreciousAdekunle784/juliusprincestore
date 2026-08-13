"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Category } from "@/types/database";
import type { ProductFilters } from "@/lib/filters";
import { formatNaira } from "@/lib/format";
import { useFilterNav } from "./use-filter-nav";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-black/[0.08]">
      <p className="eyebrow text-ink mb-3">{title}</p>
      {children}
    </div>
  );
}

export function FilterSidebar({
  filters,
  facets,
  categories,
}: {
  filters: ProductFilters;
  facets: { brands: string[]; priceMin: number; priceMax: number };
  categories?: Category[]; // provided only when the category filter should show
}) {
  const { set, clear } = useFilterNav();
  const [min, setMin] = useState(filters.minPrice?.toString() ?? "");
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? "");

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    set({ brand: next.join(",") || null });
  };

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between pb-3">
        <p className="font-display font-semibold">Filters</p>
        <button onClick={clear} className="text-xs text-slate hover:text-accent-press underline underline-offset-2">
          Clear all
        </button>
      </div>

      {categories && categories.length > 0 && (
        <Section title="Category">
          <ul className="space-y-1.5">
            {categories.map((c) => {
              const on = filters.category === c.slug;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => set({ category: on ? null : c.slug })}
                    className={`w-full text-left px-1 py-0.5 rounded-[2px] ${on ? "text-accent-press font-medium" : "text-slate hover:text-ink"}`}
                  >
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      <Section title="Availability">
        <label className="flex items-center gap-2.5 cursor-pointer text-slate">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => set({ stock: e.target.checked ? "1" : null })}
            className="accent-[color:var(--accent)] h-4 w-4"
          />
          In stock only
        </label>
      </Section>

      <Section title="Price">
        {facets.priceMax > 0 && (
          <p className="font-mono text-[0.7rem] text-slate mb-2">
            {formatNaira(facets.priceMin)} – {formatNaira(facets.priceMax)}
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min"
            className="w-full border border-black/15 rounded-[3px] px-2 py-1.5 font-mono text-xs outline-none focus:border-accent"
          />
          <span className="text-slate">–</span>
          <input
            inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max"
            className="w-full border border-black/15 rounded-[3px] px-2 py-1.5 font-mono text-xs outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={() => set({ min: min.trim() || null, max: max.trim() || null })}
          className="mt-2.5 w-full bg-ink text-paper text-xs font-semibold py-2 rounded-[3px] hover:bg-accent hover:text-ink transition-colors"
        >
          Apply price
        </button>
      </Section>

      <Section title="Rating">
        <ul className="space-y-1.5">
          {[4, 3].map((r) => {
            const on = filters.minRating === r;
            return (
              <li key={r}>
                <button
                  onClick={() => set({ rating: on ? null : String(r) })}
                  className={`flex items-center gap-1.5 ${on ? "text-accent-press" : "text-slate hover:text-ink"}`}
                >
                  <span className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < r ? "fill-accent text-accent" : "text-black/20"} />
                    ))}
                  </span>
                  &amp; up
                </button>
              </li>
            );
          })}
        </ul>
      </Section>

      {facets.brands.length > 0 && (
        <Section title="Brand">
          <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {facets.brands.map((b) => (
              <li key={b}>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    className="accent-[color:var(--accent)] h-4 w-4"
                  />
                  {b}
                </label>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
