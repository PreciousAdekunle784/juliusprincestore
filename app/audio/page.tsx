import { CategoryPage } from "@/components/shop/category-page";

export const metadata = { title: "Audio" };

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  return <CategoryPage slug="audio" searchParams={searchParams} />;
}
