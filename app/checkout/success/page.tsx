import { createAdminClient } from "@/lib/supabase/admin";
import { OrderConfirmed } from "@/components/checkout/order-confirmed";
import { CheckoutNotice } from "@/components/checkout/notice";

export const metadata = { title: "Order received", robots: { index: false } };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const orderId = first(searchParams.order);
  const method = first(searchParams.method);
  if (!orderId) return <CheckoutNotice title="Missing order" body="We couldn’t find that order reference." />;

  let admin;
  try { admin = createAdminClient(); } catch {
    return <CheckoutNotice title="Payments not configured" body="Add your Supabase service role key to finish setup." />;
  }

  const { data: order } = await admin.from("orders").select("id, total, payment_status").eq("id", orderId).maybeSingle();
  if (!order) return <CheckoutNotice title="Order not found" body="This order reference doesn’t exist." />;

  return (
    <OrderConfirmed
      orderId={order.id}
      total={Number(order.total)}
      paid={order.payment_status === "paid"}
      bank={method === "bank"}
    />
  );
}
