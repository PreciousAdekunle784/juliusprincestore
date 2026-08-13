import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FocusFrame } from "@/components/ui/focus-frame";

/** Interim placeholder for routes still being built during the staged rollout. */
export function ComingSoon({ title, step }: { title: string; step?: string }) {
  return (
    <section className="container-screen py-24 md:py-32">
      <FocusFrame size={22} className="max-w-xl mx-auto bg-charcoal text-paper rounded-[6px] px-8 py-16 text-center">
        {step && <p className="eyebrow text-accent mb-3">{step}</p>}
        <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">{title}</h1>
        <p className="mt-4 text-slate">This section is being built. It&rsquo;ll be live in an upcoming step of the rollout.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-paper hover:text-accent">
          <ArrowLeft size={15} /> Back to home
        </Link>
      </FocusFrame>
    </section>
  );
}
