import { CollectionPage } from "@/components/shop/collection-page";

export const metadata = { title: "Shop" };

export default function ShopPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <CollectionPage
      eyebrow="All products"
      title="The complete store"
      description="Every camera, lens, light, mic and accessory Julius Prince Store carries — filter and sort to find yours."
      scope={{}}
      basePath="/shop"
      searchParams={searchParams}
    />
  );
}
