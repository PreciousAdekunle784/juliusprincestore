import { CollectionPage } from "@/components/shop/collection-page";

export const metadata = { title: "New arrivals" };

export default function NewArrivalsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <CollectionPage
      eyebrow="Just landed"
      title="New arrivals"
      description="The latest gear added to Julius Prince Store."
      scope={{ newArrival: true }}
      basePath="/new-arrivals"
      searchParams={searchParams}
    />
  );
}
