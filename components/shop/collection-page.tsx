import type { CatalogScope } from "@/lib/filters";
import { CatalogHeader } from "./catalog-header";
import { Catalog } from "./catalog";

type RawParams = Record<string, string | string[] | undefined>;

export function CollectionPage({
  eyebrow = "Collection",
  title,
  description,
  scope,
  basePath,
  searchParams,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  scope: CatalogScope;
  basePath: string;
  searchParams: RawParams;
}) {
  return (
    <>
      <CatalogHeader eyebrow={eyebrow} title={title} description={description} />
      <Catalog scope={scope} basePath={basePath} searchParams={searchParams} />
    </>
  );
}
