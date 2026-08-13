import { CollectionPage } from "@/components/shop/collection-page";

export const metadata = { title: "Best sellers" };

export default function BestSellersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <CollectionPage
      eyebrow="Most wanted"
      title="Best sellers"
      description="The gear customers reach for most."
      scope={{ bestSeller: true }}
      basePath="/best-sellers"
      searchParams={searchParams}
    />
  );
}
