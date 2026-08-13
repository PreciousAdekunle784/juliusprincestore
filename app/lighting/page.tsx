import { CategoryPage } from "@/components/shop/category-page";

export const metadata = { title: "Lighting" };

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <CategoryPage slug="lighting" searchParams={searchParams} />;
}
