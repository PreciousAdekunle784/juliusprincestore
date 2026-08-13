import { CollectionPage } from "@/components/shop/collection-page";

export const metadata = { title: "Deals" };

export default function DealsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <CollectionPage
      eyebrow="On sale now"
      title="Deals"
      description="Live discounts across the store. Prices shown are the reduced prices."
      scope={{ onSale: true }}
      basePath="/deals"
      searchParams={searchParams}
    />
  );
}
