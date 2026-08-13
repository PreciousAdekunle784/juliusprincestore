import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { estimateDelivery } from "@/lib/delivery";
import { initializePaystack } from "@/lib/payments/paystack";
import { initializeFlutterwave } from "@/lib/payments/flutterwave";

interface ReqItem { productId: string; variantId?: string; quantity: number }
interface ReqBody {
  items: ReqItem[];
  customer: { name: string; email: string; phone: string; address: string; state: string };
  deliveryMethod: string;
  couponCode?: string;
  paymentMethod: "paystack" | "flutterwave" | "bank_transfer";
}

// Loose shapes for the product read (kept local to avoid over-typing the join).
interface VariantRow { id: string; name: string; price: number | null; stock_quantity: number }
interface ProductRow {
  id: string; name: string; price: number; sale_price: number | null;
  stock_quantity: number; active: boolean; variants: VariantRow[] | null;
}

export async function POST(req: Request) {
  const supabase = createClient();

  let body: ReqBody;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const { items, customer, deliveryMethod, couponCode, paymentMethod } = body;
  if (!items?.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address || !customer?.state) {
    return NextResponse.json({ error: "Please complete all delivery details." }, { status: 400 });
  }

  // ---- authoritative pricing from the database ----
  const ids = Array.from(new Set(items.map((i) => i.productId)));
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, sale_price, stock_quantity, active, variants:product_variants(id, name, price, stock_quantity)")
    .in("id", ids);
  const pmap = new Map<string, ProductRow>(((products as ProductRow[] | null) ?? []).map((p) => [p.id, p]));

  const orderItems: { product_id: string; variant_id: string | null; product_name: string; quantity: number; price: number }[] = [];
  let subtotal = 0;

  for (const it of items) {
    const p = pmap.get(it.productId);
    if (!p || !p.active) return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
    const qty = Math.max(1, Math.floor(it.quantity));
    let price: number, stock: number, name = p.name, variantId: string | null = null;

    if (it.variantId) {
      const v = (p.variants ?? []).find((x) => x.id === it.variantId);
      if (!v) return NextResponse.json({ error: "A selected option is no longer available." }, { status: 400 });
      price = v.price ?? p.sale_price ?? p.price;
      stock = v.stock_quantity; name = `${p.name} — ${v.name}`; variantId = v.id;
    } else {
      price = p.sale_price ?? p.price; stock = p.stock_quantity;
    }

    if (stock < qty) return NextResponse.json({ error: `Not enough stock for ${name}.` }, { status: 400 });
    subtotal += price * qty;
    orderItems.push({ product_id: p.id, variant_id: variantId, product_name: name, quantity: qty, price });
  }

  // ---- coupon (validated server-side) ----
  let discount = 0;
  let appliedCoupon: string | null = null;
  if (couponCode) {
    const { data: c } = await supabase.rpc("validate_coupon", { coupon_code: couponCode });
    const coupon = Array.isArray(c) ? c[0] : c;
    if (coupon) {
      discount =
        coupon.discount_type === "percentage"
          ? Math.round((subtotal * Number(coupon.discount_value)) / 100)
          : Number(coupon.discount_value);
      discount = Math.min(discount, subtotal);
      appliedCoupon = coupon.code;
    }
  }

  const deliveryFee = estimateDelivery(customer.state, deliveryMethod);
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const { data: { user } } = await supabase.auth.getUser();
  const reference = "jp_" + randomBytes(10).toString("hex");

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      delivery_address: customer.address,
      state: customer.state,
      delivery_method: deliveryMethod,
      subtotal, delivery_fee: deliveryFee, discount, total,
      coupon_code: appliedCoupon,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
      payment_ref: reference,
    })
    .select("id")
    .single();

  if (orderErr || !order) return NextResponse.json({ error: "Could not create your order. Please try again." }, { status: 500 });

  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(orderItems.map((oi) => ({ ...oi, order_id: order.id })));
  if (itemsErr) return NextResponse.json({ error: "Could not save your order. Please try again." }, { status: 500 });

  // ---- start payment ----
  try {
    if (paymentMethod === "bank_transfer") {
      return NextResponse.json({ redirect: `/checkout/success?order=${order.id}&method=bank` });
    }
    if (paymentMethod === "paystack") {
      const url = await initializePaystack({
        email: customer.email,
        amountKobo: Math.round(total * 100),
        reference,
        callbackUrl: `${site.url}/checkout/verify?order=${order.id}&provider=paystack`,
      });
      return NextResponse.json({ redirect: url });
    }
    if (paymentMethod === "flutterwave") {
      const url = await initializeFlutterwave({
        email: customer.email, amount: total, txRef: reference,
        name: customer.name, phone: customer.phone,
        redirectUrl: `${site.url}/checkout/verify?order=${order.id}&provider=flutterwave`,
      });
      return NextResponse.json({ redirect: url });
    }
    return NextResponse.json({ error: "Unsupported payment method." }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Payment could not be started.";
    return NextResponse.json({ error: message, orderId: order.id }, { status: 502 });
  }
}
