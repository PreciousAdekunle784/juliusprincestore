import Link from "next/link";

/** Wordmark: a focus-framed JP monogram + the store name. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Julius Prince Store — home">
      <span className="relative grid h-9 w-9 place-items-center bg-accent text-ink font-display font-extrabold text-sm rounded-[3px]">
        JP
        <span aria-hidden className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-accent transition-all group-hover:-top-1.5 group-hover:-left-1.5" />
        <span aria-hidden className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-accent transition-all group-hover:-bottom-1.5 group-hover:-right-1.5" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display font-bold tracking-tight text-[0.95rem] text-paper">
            JULIUS PRINCE
          </span>
          <span className="eyebrow text-accent">Store</span>
        </span>
      )}
    </Link>
  );
}
