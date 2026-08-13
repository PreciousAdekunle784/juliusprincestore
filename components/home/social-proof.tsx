import { Star } from "lucide-react";
import type { Review } from "@/types/database";

type ReviewWithProduct = Review & { product?: { name: string; slug: string } };

/** No fabricated testimonials: this section is only rendered when real, approved reviews exist. */
export function SocialProof({ reviews }: { reviews: ReviewWithProduct[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-ink text-paper">
      <div className="container-screen py-14 md:py-20">
        <div className="mb-8">
          <p className="eyebrow text-accent mb-2">From our customers</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">What creators are saying</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="bg-charcoal border border-graphite rounded-[5px] p-6">
              <div className="flex gap-0.5 mb-3" aria-label={`${r.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className={i < r.rating ? "fill-accent text-accent" : "text-graphite"} />
                ))}
              </div>
              {r.review && <blockquote className="text-sm text-mist/85 leading-relaxed">{r.review}</blockquote>}
              {r.product?.name && (
                <figcaption className="eyebrow text-slate mt-4">on {r.product.name}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
