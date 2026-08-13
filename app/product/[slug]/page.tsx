import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import {
  getProductBySlug,
  getRelatedProducts,
  getComplementaryProducts,
  getProductReviews,
} from "@/lib/queries";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Gallery } from "@/components/product/detail/gallery";
import { BuyBox } from "@/components/product/detail/buy-box";
import { SpecsTable } from "@/components/product/detail/specs-table";
import { Reviews } from "@/components/product/detail/reviews";
import { ProductRail } from "@/components/product/product-rail";

interface Params {
  params: { slug: string };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  const description = (product.description ?? site.tagline).slice(0, 155);
  const url = `${site.url}/product/${product.slug}`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: "website",
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, complementary, reviews] = await Promise.all([
    getRelatedProducts(product),
    getComplementaryProducts(product),
    getProductReviews(product.id),
  ]);

  const price = product.sale_price ?? product.price;
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images?.length ? product.images : undefined,
    description: product.description ?? undefined,
    sku: product.sku ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price,
      availability:
        product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/product/${product.slug}`,
    },
    aggregateRating:
      (product.review_count ?? 0) > 0
        ? { "@type": "AggregateRating", ratingValue: product.avg_rating, reviewCount: product.review_count }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-screen py-6 md:py-10 pb-28 lg:pb-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            product.category
              ? { label: product.category.name, href: `/${product.category.slug}` }
              : { label: "Shop", href: "/shop" },
            { label: product.name },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
          <Gallery images={product.images ?? []} name={product.name} />
          <BuyBox product={product} />
        </div>

        {product.description && (
          <section className="mt-14 max-w-3xl">
            <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-4">Overview</h2>
            <p className="text-ink/85 leading-relaxed whitespace-pre-line">{product.description}</p>
          </section>
        )}

        <SpecsTable specs={product.specifications} />
        <Reviews avg={product.avg_rating ?? 0} count={product.review_count ?? 0} reviews={reviews} />
      </div>

      {complementary.length > 0 && (
        <ProductRail eyebrow="Complete your kit" title="You may also need" products={complementary} />
      )}
      {related.length > 0 && (
        <ProductRail
          eyebrow="Related"
          title={`More in ${product.category?.name ?? "the store"}`}
          products={related}
          viewAllHref={product.category ? `/${product.category.slug}` : "/shop"}
        />
      )}
    </>
  );
}
