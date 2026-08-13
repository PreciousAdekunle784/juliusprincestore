export default function ProductLoading() {
  return (
    <div className="container-screen py-8 md:py-12">
      <div className="h-4 w-64 bg-mist rounded animate-pulse mb-8" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-mist rounded-[6px] animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-mist rounded animate-pulse" />
          <div className="h-9 w-3/4 bg-mist rounded animate-pulse" />
          <div className="h-7 w-32 bg-mist rounded animate-pulse" />
          <div className="h-px bg-mist my-4" />
          <div className="h-4 w-full bg-mist rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-mist rounded animate-pulse" />
          <div className="h-12 w-full bg-mist rounded animate-pulse mt-6" />
        </div>
      </div>
    </div>
  );
}
