import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAdminProduct } from "@/lib/admin";
import { getCategories } from "@/lib/queries";
import { ProductForm } from "@/components/admin/product-form";
import { VariantsEditor } from "@/components/admin/variants-editor";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([getAdminProduct(params.id), getCategories()]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink"><ArrowLeft size={15} /> Products</Link>
        <Link href={`/product/${product.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-accent-press hover:underline">View live <ExternalLink size={14} /></Link>
      </div>
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Edit product</h1>
      <ProductForm categories={categories} initial={product} productId={product.id} />
      <VariantsEditor productId={product.id} variants={product.variants ?? []} />
    </div>
  );
}
