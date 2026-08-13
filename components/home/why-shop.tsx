import { ShieldCheck, Truck, Headphones } from "lucide-react";

/**
 * Only genuine, structurally-true advantages are listed. Do NOT add "authentic"
 * / "warranty" / "100% original" style claims here unless the client confirms
 * them — then append an item to this array. (Brief §28.)
 */
const points = [
  {
    icon: ShieldCheck,
    title: "Secure payments",
    body: "Pay with Paystack, Flutterwave or bank transfer. Your order is only confirmed once payment is verified.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    body: "Gear delivered to you anywhere in Nigeria, with delivery calculated at checkout.",
  },
  {
    icon: Headphones,
    title: "Real human support",
    body: "Questions about a product or your order? Reach us on WhatsApp for a straight answer.",
  },
];

export function WhyShop() {
  return (
    <section className="bg-mist">
      <div className="container-screen py-14 md:py-20">
        <div className="mb-8">
          <p className="eyebrow text-accent-press mb-2">Why Julius Prince Store</p>
          <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
            Higher-stakes gear, bought with confidence
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {points.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-paper border border-black/[0.07] rounded-[5px] p-6">
              <span className="grid place-items-center h-11 w-11 rounded-[4px] bg-ink text-accent mb-4">
                <Icon size={20} />
              </span>
              <h3 className="font-display font-semibold text-lg mb-1.5">{title}</h3>
              <p className="text-sm text-slate leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
