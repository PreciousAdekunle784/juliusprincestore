import { CategoryPage } from "@/components/shop/category-page";

export const metadata = { title: "Electronics" };

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <CategoryPage slug="electronics" searchParams={searchParams} />;
}
