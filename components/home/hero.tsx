import Link from "next/link";
import { ArrowRight, Aperture, Truck, ShieldCheck } from "lucide-react";
import { FocusFrame } from "@/components/ui/focus-frame";

export function Hero() {
  return (
    <section className="relative bg-ink text-paper overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--slate) 1px, transparent 1px), linear-gradient(90deg, var(--slate) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="container-screen relative py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent mb-6 flex items-center gap-2 animate-rise">
            <Aperture size={14} /> Julius Prince Store
          </p>

          <FocusFrame animate size={26} className="inline-block px-1 py-1">
            <h1 className="font-display font-extrabold leading-[0.98] tracking-tight text-5xl md:text-7xl">
              Capture More.
              <br />
              Create Better.
            </h1>
          </FocusFrame>

          <p className="mt-8 max-w-xl text-lg text-mist/80 leading-relaxed animate-rise">
            Professional cameras, photography gear, and electronics for creators,
            photographers, filmmakers, and businesses.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 animate-rise">
            <Link href="/cameras" className="btn-accent">
              Shop cameras <ArrowRight size={18} />
            </Link>
            <Link href="/accessories" className="btn-ghost">
              Explore accessories
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            <span className="eyebrow text-slate flex items-center gap-2">
              <Truck size={14} className="text-accent" /> Nationwide delivery
            </span>
            <span className="eyebrow text-slate flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent" /> Secure checkout
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
