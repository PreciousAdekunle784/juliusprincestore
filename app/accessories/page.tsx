import { CategoryPage } from "@/components/shop/category-page";

export const metadata = { title: "Accessories" };

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <CategoryPage slug="accessories" searchParams={searchParams} />;
}
