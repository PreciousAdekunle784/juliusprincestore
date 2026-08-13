import type { Review } from "@/types/database";
import { StarRating } from "@/components/ui/star-rating";

export function Reviews({
  avg,
  count,
  reviews,
}: {
  avg: number;
  count: number;
  reviews: Review[];
}) {
  return (
    <section className="mt-14">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight">Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={avg} />
            <span className="font-mono text-sm text-slate">
              {avg.toFixed(1)} · {count}
            </span>
          </div>
        )}
      </div>

      {count === 0 ? (
        <p className="text-sm text-slate">
          No reviews yet. Verified customers can leave a review once accounts are enabled.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="border border-black/[0.08] rounded-[5px] p-5">
              <StarRating value={r.rating} size={14} />
              {r.review && <p className="mt-2.5 text-sm text-ink/85 leading-relaxed">{r.review}</p>}
              <p className="eyebrow text-slate mt-3">
                {new Date(r.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
