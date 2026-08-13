import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProduct() {
  const categories = await getCategories();
  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink"><ArrowLeft size={15} /> Products</Link>
      <h1 className="font-display font-extrabold text-2xl tracking-tight">New product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
