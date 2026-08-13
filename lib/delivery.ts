export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
] as const;

export const DELIVERY_METHODS = [
  { id: "standard", label: "Standard delivery", note: "2–5 business days" },
  { id: "express", label: "Express delivery", note: "1–2 business days" },
] as const;

export type DeliveryMethodId = (typeof DELIVERY_METHODS)[number]["id"];

/**
 * Flat delivery estimate. These are placeholder rates — adjust to the store's
 * real logistics pricing (or wire a courier API) without touching the UI.
 */
export function estimateDelivery(state: string | undefined, method: string): number {
  const isLagos = (state ?? "").toLowerCase().startsWith("lagos");
  const base = isLagos ? 2500 : 4000;
  return method === "express" ? base + 2000 : base;
}
