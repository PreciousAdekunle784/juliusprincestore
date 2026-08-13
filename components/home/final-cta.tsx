import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { FocusFrame } from "@/components/ui/focus-frame";

export function FinalCTA() {
  return (
    <section className="container-screen py-16 md:py-24">
      <FocusFrame size={22} className="bg-charcoal rounded-[6px] px-6 py-14 md:px-16 md:py-20 text-center text-paper">
        <p className="eyebrow text-accent mb-4">Ready when you are</p>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight max-w-2xl mx-auto leading-[1.02]">
          Your next shot starts with the right gear.
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="btn-accent">
            Shop the store <ArrowRight size={18} />
          </Link>
          <a href={whatsappLink("Hi Julius Prince Store, I'd like some help choosing gear.")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <MessageCircle size={17} /> Ask on WhatsApp
          </a>
        </div>
      </FocusFrame>
    </section>
  );
}
