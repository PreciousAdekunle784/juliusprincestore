import { cn } from "@/lib/utils";

/**
 * The store's signature motif: amber AF-point corner brackets that "lock focus"
 * around whatever they wrap — the hero, a featured product, a hover state.
 */
export function FocusFrame({
  children,
  className,
  animate = false,
  size = 18,
}: {
  children?: React.ReactNode;
  className?: string;
  animate?: boolean;
  size?: number;
}) {
  const corner = "absolute w-[--s] h-[--s] border-accent pointer-events-none";
  const style = { "--s": `${size}px` } as React.CSSProperties;
  return (
    <div className={cn("relative", animate && "animate-focus-lock", className)}>
      {children}
      <span style={style} className={cn(corner, "top-0 left-0 border-t-2 border-l-2")} aria-hidden />
      <span style={style} className={cn(corner, "top-0 right-0 border-t-2 border-r-2")} aria-hidden />
      <span style={style} className={cn(corner, "bottom-0 left-0 border-b-2 border-l-2")} aria-hidden />
      <span style={style} className={cn(corner, "bottom-0 right-0 border-b-2 border-r-2")} aria-hidden />
    </div>
  );
}
