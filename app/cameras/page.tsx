import { CategoryPage } from "@/components/shop/category-page";

export const metadata = { title: "Cameras" };

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <CategoryPage slug="cameras" searchParams={searchParams} />;
}
