import { PackageSearch } from "lucide-react";
import type { CatalogScope } from "@/lib/filters";
import { parseFilters, activeFilterCount, PAGE_SIZE } from "@/lib/filters";
import { getCategories, getProducts, getFilterFacets } from "@/lib/queries";
import { ProductCard } from "@/components/product/product-card";
import { SortSelect } from "./sort-select";
import { ShopSearch } from "./shop-search";
import { FilterSidebar } from "./filter-sidebar";
import { ActiveFilters } from "./active-filters";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { Pagination } from "./pagination";

type RawParams = Record<string, string | string[] | undefined>;

export async function Catalog({
  scope = {},
  basePath,
  searchParams,
}: {
  scope?: CatalogScope;
  basePath: string;
  searchParams: RawParams;
}) {
  const filters = parseFilters(searchParams);
  const categories = await getCategories();

  const showCategory = !scope.category;
  const activeCategorySlug = scope.category ?? filters.category;
  const categoryId = activeCategorySlug
    ? categories.find((c) => c.slug === activeCategorySlug)?.id
    : undefined;

  const [{ products, total }, facets] = await Promise.all([
    getProducts({ ...filters, categoryId, scope }),
    getFilterFacets({ categoryId, scope }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const count = activeFilterCount(filters, showCategory);
  const filterCategories = showCategory ? categories.filter((c) => c.slug !== "deals") : undefined;
  const priceKey = `${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}`;

  return (
    <section className="container-screen py-8 md:py-10">
      {/* toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <p className="text-sm text-slate">
          <span className="font-mono text-ink">{total}</span> {total === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2.5">
          <ShopSearch key={`s-${filters.q}`} initial={filters.q} />
          <SortSelect value={filters.sort} />
          <MobileFilterDrawer filters={filters} facets={facets} categories={filterCategories} count={count} />
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSidebar key={priceKey} filters={filters} facets={facets} categories={filterCategories} />
          </div>
        </aside>

        <div>
          <ActiveFilters filters={filters} categories={categories} showCategory={showCategory} />

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-[5px] border border-dashed border-black/15 bg-mist/60 px-6 py-20 text-center">
              <PackageSearch size={30} className="mx-auto text-slate mb-3" />
              <p className="font-medium text-ink">
                {count > 0 ? "No products match these filters" : "Nothing here just yet"}
              </p>
              <p className="mt-1 text-sm text-slate">
                {count > 0
                  ? "Try widening your search or clearing a filter."
                  : "Products appear here as soon as they’re added to the store."}
              </p>
            </div>
          )}

          <Pagination basePath={basePath} searchParams={searchParams} page={filters.page} totalPages={totalPages} />
        </div>
      </div>
    </section>
  );
}
