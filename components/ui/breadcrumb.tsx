import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1 text-xs text-slate">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {it.href ? (
            <Link href={it.href} className="hover:text-accent-press">{it.label}</Link>
          ) : (
            <span className="text-ink truncate max-w-[60vw]">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={13} className="text-black/30" />}
        </span>
      ))}
    </nav>
  );
}
