const BASE = "https://api.paystack.co";

function secret() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

/** Initialize a transaction; returns the hosted checkout URL. amountKobo = NGN × 100. */
export async function initializePaystack(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
}): Promise<string> {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: opts.email,
      amount: opts.amountKobo,
      reference: opts.reference,
      callback_url: opts.callbackUrl,
      currency: "NGN",
    }),
  });
  const json = await res.json();
  if (!json.status) throw new Error(json.message ?? "Paystack initialization failed");
  return json.data.authorization_url as string;
}

/** Verify a transaction. amount returned is in kobo. */
export async function verifyPaystack(reference: string): Promise<{ success: boolean; amountKobo: number }> {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  const json = await res.json();
  return {
    success: Boolean(json.status && json.data?.status === "success"),
    amountKobo: Number(json.data?.amount ?? 0),
  };
}
