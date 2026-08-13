import { Star } from "lucide-react";

export function StarRating({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? "fill-accent text-accent" : "text-black/20"}
        />
      ))}
    </span>
  );
}
