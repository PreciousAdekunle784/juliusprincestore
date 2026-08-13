import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductRail } from "@/components/product/product-rail";
import { WhyShop } from "@/components/home/why-shop";
import { SocialProof } from "@/components/home/social-proof";
import { FinalCTA } from "@/components/home/final-cta";
import {
  getCategories,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getFeaturedReviews,
} from "@/lib/queries";

// Homepage revalidates every 5 minutes; product/admin mutations can revalidate on demand later.
export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured, bestSellers, newArrivals, reviews] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getBestSellers(8),
    getNewArrivals(4),
    getFeaturedReviews(6),
  ]);

  return (
    <>
      <Hero />
      <CategoryGrid categories={categories} />
      <ProductRail eyebrow="Hand-picked" title="Featured products" products={featured} viewAllHref="/shop" />
      <WhyShop />
      <ProductRail eyebrow="Most wanted" title="Best sellers" products={bestSellers} viewAllHref="/best-sellers" />
      <ProductRail eyebrow="Just landed" title="New arrivals" products={newArrivals} viewAllHref="/new-arrivals" />
      <SocialProof reviews={reviews} />
      <FinalCTA />
    </>
  );
}
