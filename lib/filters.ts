export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Most popular" },
  { key: "price_asc", label: "Price: low to high" },
  { key: "price_desc", label: "Price: high to low" },
  { key: "rated", label: "Best rated" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];
const SORT_KEYS = SORT_OPTIONS.map((s) => s.key);

/** A locked scope applied by a page (category slug or a collection flag). */
export interface CatalogScope {
  category?: string; // category slug — hides the category filter when set
  newArrival?: boolean;
  bestSeller?: boolean;
  onSale?: boolean; // "deals" — products with a real discount
}

export interface ProductFilters {
  q: string;
  category?: string; // slug chosen via the filter (only used when scope.category is unset)
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  minRating?: number;
  sort: SortKey;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string | undefined {
  const x = Array.isArray(v) ? v[0] : v;
  return x && x.length ? x : undefined;
}
function num(v: string | string[] | undefined): number | undefined {
  const s = str(v);
  if (s === undefined) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(sp: RawParams): ProductFilters {
  const sortRaw = str(sp.sort) as SortKey | undefined;
  return {
    q: (str(sp.q) ?? "").slice(0, 80),
    category: str(sp.category),
    brands: (str(sp.brand) ?? "").split(",").map((b) => b.trim()).filter(Boolean),
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
    inStock: str(sp.stock) === "1",
    minRating: num(sp.rating),
    sort: sortRaw && SORT_KEYS.includes(sortRaw) ? sortRaw : "newest",
    page: Math.max(1, num(sp.page) ?? 1),
  };
}

/** Count of user-applied filters (for the mobile "Filters (n)" badge). */
export function activeFilterCount(f: ProductFilters, showCategory: boolean): number {
  let n = 0;
  if (f.q) n++;
  if (showCategory && f.category) n++;
  n += f.brands.length;
  if (f.minPrice !== undefined || f.maxPrice !== undefined) n++;
  if (f.inStock) n++;
  if (f.minRating) n++;
  return n;
}

/** Build an href preserving current params, overriding page. */
export function pageHref(basePath: string, sp: RawParams, page: number): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v == null) continue;
    const val = Array.isArray(v) ? v[0] : v;
    if (val) params.set(k, val);
  }
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
