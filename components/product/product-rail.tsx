import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/database";
import { ProductCard } from "@/components/product/product-card";

/** A titled section of product cards, with an empty-state when the catalog is bare. */
export function ProductRail({
  eyebrow,
  title,
  products,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  return (
    <section className="container-screen py-14 md:py-20">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          {eyebrow && <p className="eyebrow text-accent-press mb-2">{eyebrow}</p>}
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">{title}</h2>
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent-press whitespace-nowrap">
            View all <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-[5px] border border-dashed border-black/15 bg-mist/60 px-6 py-14 text-center">
          <p className="font-medium text-ink">Nothing here just yet</p>
          <p className="mt-1 text-sm text-slate">
            New {title.toLowerCase()} land here as soon as they&rsquo;re added to the store.
          </p>
        </div>
      )}
    </section>
  );
}
