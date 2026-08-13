import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { FocusFrame } from "@/components/ui/focus-frame";

export default function NotFound() {
  return (
    <section className="container-screen py-24 md:py-32">
      <FocusFrame size={22} className="max-w-lg mx-auto bg-charcoal text-paper rounded-[6px] px-8 py-16 text-center">
        <p className="eyebrow text-accent mb-3">Error 404</p>
        <h1 className="font-display font-extrabold text-4xl tracking-tight">Out of frame</h1>
        <p className="mt-4 text-slate">We couldn&rsquo;t find that page. It may have moved or sold out.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-accent"><ArrowLeft size={17} /> Home</Link>
          <Link href="/shop" className="btn-ghost"><Search size={16} /> Browse the store</Link>
        </div>
      </FocusFrame>
    </section>
  );
}
