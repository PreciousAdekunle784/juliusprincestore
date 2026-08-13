import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPaystack } from "@/lib/payments/paystack";
import { verifyFlutterwave } from "@/lib/payments/flutterwave";
import { OrderConfirmed } from "@/components/checkout/order-confirmed";
import { CheckoutNotice } from "@/components/checkout/notice";

export const metadata = { title: "Payment", robots: { index: false } };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const orderId = first(searchParams.order);
  const provider = first(searchParams.provider);
  if (!orderId) return <CheckoutNotice title="Missing order" body="We couldn’t find that order reference." />;

  let admin;
  try { admin = createAdminClient(); } catch {
    return <CheckoutNotice title="Payments not configured" body="Add your Supabase service role key and payment keys to finish setup." />;
  }

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return <CheckoutNotice title="Order not found" body="This order reference doesn’t exist." />;
  if (order.payment_status === "paid") {
    return <OrderConfirmed orderId={order.id} total={Number(order.total)} paid />;
  }

  let ok = false;
  try {
    if (provider === "paystack") {
      const r = await verifyPaystack(order.payment_ref);
      ok = r.success && r.amountKobo === Math.round(Number(order.total) * 100);
    } else if (provider === "flutterwave") {
      const txId = first(searchParams.transaction_id);
      const status = first(searchParams.status);
      if (txId && status !== "cancelled") {
        const r = await verifyFlutterwave(txId);
        ok = r.success && r.amount >= Number(order.total) && r.currency === "NGN";
      }
    }
  } catch {
    ok = false;
  }

  if (ok) {
    await admin.from("orders").update({ payment_status: "paid", order_status: "confirmed" }).eq("id", order.id);
    const { data: its } = await admin
      .from("order_items")
      .select("product_id, variant_id, quantity")
      .eq("order_id", order.id);
    for (const it of its ?? []) {
      if (it.variant_id) await admin.rpc("decrement_variant_stock", { v_id: it.variant_id, p_qty: it.quantity });
      else if (it.product_id) await admin.rpc("decrement_product_stock", { p_id: it.product_id, p_qty: it.quantity });
    }
    return <OrderConfirmed orderId={order.id} total={Number(order.total)} paid />;
  }

  return (
    <CheckoutNotice
      title="Payment not completed"
      body="We couldn’t confirm your payment. If you were charged, contact us on WhatsApp and we’ll sort it out."
      retry
    />
  );
}
