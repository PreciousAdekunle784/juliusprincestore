import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { pageHref } from "@/lib/filters";

type RawParams = Record<string, string | string[] | undefined>;

/** Windowed page numbers around the current page. */
function pageWindow(current: number, total: number): number[] {
  const span = 2;
  const start = Math.max(1, current - span);
  const end = Math.min(total, current + span);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string;
  searchParams: RawParams;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages);
  const link = "grid place-items-center min-w-[38px] h-[38px] px-2 rounded-[3px] border text-sm font-mono transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
      <Link
        href={pageHref(basePath, searchParams, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={`${link} ${page === 1 ? "border-black/10 text-black/25 pointer-events-none" : "border-black/15 hover:border-accent"}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Link>

      {pages[0] > 1 && <span className="px-1 text-slate">…</span>}
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(basePath, searchParams, p)}
          aria-current={p === page ? "page" : undefined}
          className={`${link} ${p === page ? "bg-ink text-paper border-ink" : "border-black/15 hover:border-accent"}`}
        >
          {p}
        </Link>
      ))}
      {pages[pages.length - 1] < totalPages && <span className="px-1 text-slate">…</span>}

      <Link
        href={pageHref(basePath, searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={`${link} ${page === totalPages ? "border-black/10 text-black/25 pointer-events-none" : "border-black/15 hover:border-accent"}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
