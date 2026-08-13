import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllProductSlugs, getCategories } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getCategories()]);
  const now = new Date();

  const staticRoutes = ["", "/shop", "/deals", "/new-arrivals", "/best-sellers", "/about", "/contact"].map(
    (path) => ({ url: `${site.url}${path}`, lastModified: now })
  );
  const categoryRoutes = categories.map((c) => ({ url: `${site.url}/${c.slug}`, lastModified: now }));
  const productRoutes = slugs.map((slug) => ({ url: `${site.url}/product/${slug}`, lastModified: now }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
