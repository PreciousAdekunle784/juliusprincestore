export function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-paper border border-black/[0.07] rounded-[4px] overflow-hidden">
      <div className="aspect-square bg-mist animate-pulse" />
      <div className="flex flex-col gap-2 p-3.5">
        <div className="h-2 w-12 bg-mist rounded animate-pulse" />
        <div className="h-3.5 w-4/5 bg-mist rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-mist rounded animate-pulse" />
        <div className="h-10 w-full bg-mist rounded animate-pulse mt-2" />
      </div>
    </div>
  );
}
