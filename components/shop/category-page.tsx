import { CatalogHeader } from "./catalog-header";
import { Catalog } from "./catalog";
import { getCategoryBySlug } from "@/lib/queries";

type RawParams = Record<string, string | string[] | undefined>;

export async function CategoryPage({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: RawParams;
}) {
  const category = await getCategoryBySlug(slug);
  return (
    <>
      <CatalogHeader
        eyebrow="Category"
        title={category?.name ?? slug}
        description={category?.description}
      />
      <Catalog scope={{ category: slug }} basePath={`/${slug}`} searchParams={searchParams} />
    </>
  );
}
