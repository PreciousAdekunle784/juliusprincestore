import { formatNaira, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  salePrice,
  className,
  size = "base",
}: {
  price: number;
  salePrice?: number | null;
  className?: string;
  size?: "base" | "lg";
}) {
  const off = discountPercent(price, salePrice);
  const active = off !== null ? salePrice! : price;
  const big = size === "lg";
  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("font-mono font-medium text-ink", big ? "text-2xl" : "text-[0.95rem]")}>
        {formatNaira(active)}
      </span>
      {off !== null && (
        <>
          <span className={cn("font-mono text-slate line-through", big ? "text-base" : "text-xs")}>
            {formatNaira(price)}
          </span>
          <span className="eyebrow text-[0.6rem] bg-accent/15 text-accent-press px-1.5 py-0.5 rounded-[2px]">
            −{off}%
          </span>
        </>
      )}
    </div>
  );
}
