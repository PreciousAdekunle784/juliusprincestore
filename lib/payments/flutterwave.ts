const BASE = "https://api.flutterwave.com/v3";

function secret() {
  const key = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!key) throw new Error("FLUTTERWAVE_SECRET_KEY is not set");
  return key;
}

/** Initialize a Standard payment; returns the hosted payment link. amount = NGN. */
export async function initializeFlutterwave(opts: {
  email: string;
  amount: number;
  txRef: string;
  redirectUrl: string;
  name?: string;
  phone?: string;
}): Promise<string> {
  const res = await fetch(`${BASE}/payments`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      tx_ref: opts.txRef,
      amount: opts.amount,
      currency: "NGN",
      redirect_url: opts.redirectUrl,
      customer: { email: opts.email, name: opts.name, phonenumber: opts.phone },
    }),
  });
  const json = await res.json();
  if (json.status !== "success") throw new Error(json.message ?? "Flutterwave initialization failed");
  return json.data.link as string;
}

export async function verifyFlutterwave(
  transactionId: string
): Promise<{ success: boolean; amount: number; currency: string }> {
  const res = await fetch(`${BASE}/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  const json = await res.json();
  const d = json.data;
  return {
    success: json.status === "success" && d?.status === "successful",
    amount: Number(d?.amount ?? 0),
    currency: String(d?.currency ?? ""),
  };
}
