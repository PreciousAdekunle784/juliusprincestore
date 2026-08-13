import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export function CheckoutNotice({ title, body, retry = false }: { title: string; body: string; retry?: boolean }) {
  return (
    <section className="container-screen py-20 max-w-lg text-center">
      <span className="mx-auto grid place-items-center h-14 w-14 rounded-full bg-mist text-slate">
        <AlertTriangle size={26} />
      </span>
      <h1 className="font-display font-bold text-2xl mt-5">{title}</h1>
      <p className="text-slate mt-2">{body}</p>
      <div className="mt-7 flex justify-center gap-3">
        {retry && <Link href="/checkout" className="btn-accent"><RotateCcw size={16} /> Try again</Link>}
        <Link href="/" className="btn-ghost !text-ink !border-black/20 hover:!border-accent">Home</Link>
      </div>
    </section>
  );
}
