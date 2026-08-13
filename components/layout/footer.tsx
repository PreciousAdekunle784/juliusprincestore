import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { Logo } from "@/components/ui/logo";

const shop = [
  { label: "Cameras", href: "/cameras" },
  { label: "Lenses", href: "/lenses" },
  { label: "Accessories", href: "/accessories" },
  { label: "Lighting", href: "/lighting" },
  { label: "Audio", href: "/audio" },
  { label: "Deals", href: "/deals" },
];
const help = [
  { label: "Track your order", href: "/account" },
  { label: "Contact us", href: "/contact" },
  { label: "WhatsApp support", href: whatsappLink() },
  { label: "About", href: "/about" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-mist border-t border-graphite">
      <div className="container-screen py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate leading-relaxed">
            {site.tagline} Gear for creators, photographers, filmmakers and businesses across Nigeria.
          </p>
        </div>

        <nav aria-label="Shop">
          <p className="eyebrow text-accent mb-4">Shop</p>
          <ul className="space-y-2.5">
            {shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-mist/80 hover:text-accent">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <p className="eyebrow text-accent mb-4">Help</p>
          <ul className="space-y-2.5">
            {help.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-mist/80 hover:text-accent">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-graphite">
        <div className="container-screen py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="eyebrow text-[0.6rem] text-slate">
            Paystack · Flutterwave · Bank transfer
          </p>
        </div>
      </div>
    </footer>
  );
}
