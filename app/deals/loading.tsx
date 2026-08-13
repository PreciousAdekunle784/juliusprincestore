import { ProductSkeleton } from "@/components/product/product-skeleton";

export default function ShopLoading() {
  return (
    <div className="container-screen py-8 md:py-10">
      <div className="h-8 w-40 bg-mist rounded animate-pulse mb-8" />
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <div className="hidden lg:block space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-mist rounded animate-pulse" />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
