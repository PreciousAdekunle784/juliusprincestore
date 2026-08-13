/**
 * Central store configuration. The announcement text, WhatsApp number and nav
 * live here for now; the admin dashboard will make the marketing-facing bits
 * database-editable in a later step.
 */
export const site = {
  name: "Julius Prince Store",
  shortName: "JP Store",
  tagline: "Professional cameras, gear & electronics.",
  announcement: "Authentic camera & electronics  •  Nationwide delivery  •  Shop with confidence",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Bank-transfer details shown at checkout — replace with the store's real account.
  bank: {
    name: "Your Bank",
    accountName: "Julius Prince Store",
    accountNumber: "0000000000",
  },
};

/** Primary navigation — mirrors the category slugs in the database. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cameras", href: "/cameras" },
  { label: "Lenses", href: "/lenses" },
  { label: "Accessories", href: "/accessories" },
  { label: "Lighting", href: "/lighting" },
  { label: "Audio", href: "/audio" },
  { label: "Electronics", href: "/electronics" },
  { label: "Deals", href: "/deals" },
] as const;

/** Build a WhatsApp deep link with an optional pre-filled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
