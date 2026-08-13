import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-screen py-10">
          <p className="eyebrow text-accent mb-2">Secure checkout</p>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">Checkout</h1>
        </div>
      </section>
      <CheckoutForm />
    </>
  );
}
