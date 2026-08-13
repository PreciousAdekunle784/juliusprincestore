import Link from "next/link";
import Image from "next/image";
import { Camera, Aperture, Package, Sun, Mic, Cpu, Tag, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { Category } from "@/types/database";

const ICONS: Record<string, LucideIcon> = {
  cameras: Camera,
  lenses: Aperture,
  accessories: Package,
  lighting: Sun,
  audio: Mic,
  electronics: Cpu,
  deals: Tag,
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="container-screen py-14 md:py-20">
      <div className="mb-8">
        <p className="eyebrow text-accent-press mb-2">Browse the store</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">Shop by category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = ICONS[cat.slug] ?? Package;
          const isDeals = cat.slug === "deals";
          return (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className={`group relative flex flex-col justify-between h-40 md:h-48 p-5 rounded-[5px] overflow-hidden border transition-colors ${
                isDeals
                  ? "bg-accent border-accent text-ink"
                  : "bg-charcoal border-graphite text-paper hover:border-accent"
              }`}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover opacity-40 group-hover:opacity-55 transition-opacity"
                />
              )}
              <div className="relative flex items-start justify-between">
                <Icon size={26} className={isDeals ? "text-ink" : "text-accent"} />
                <ArrowUpRight
                  size={18}
                  className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isDeals ? "text-ink/70" : "text-slate"}`}
                />
              </div>
              <span className="relative font-display font-semibold text-lg tracking-tight">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
