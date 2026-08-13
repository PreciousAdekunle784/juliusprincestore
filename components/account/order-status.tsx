import { Check } from "lucide-react";
import type { OrderStatus, PaymentStatus } from "@/types/database";

const ORDER_STEPS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

const ORDER_STYLE: Record<OrderStatus, string> = {
  pending: "bg-mist text-slate",
  confirmed: "bg-accent/15 text-accent-press",
  processing: "bg-accent/15 text-accent-press",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAY_STYLE: Record<PaymentStatus, string> = {
  pending: "bg-mist text-slate",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-amber-100 text-amber-700",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`eyebrow text-[0.6rem] px-2 py-1 rounded-[2px] ${ORDER_STYLE[status]}`}>{status}</span>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <span className={`eyebrow text-[0.6rem] px-2 py-1 rounded-[2px] ${PAY_STYLE[status]}`}>{status}</span>;
}

export function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <p className="eyebrow text-red-700">This order was cancelled</p>;
  }
  const currentIdx = ORDER_STEPS.indexOf(status);
  return (
    <ol className="flex items-center">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <li key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`grid place-items-center h-7 w-7 rounded-full text-[0.7rem] ${done ? "bg-accent text-ink" : "bg-mist text-slate"}`}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={`eyebrow text-[0.55rem] ${done ? "text-ink" : "text-slate"}`}>{step}</span>
            </div>
            {i < ORDER_STEPS.length - 1 && <span className={`h-0.5 flex-1 mx-1 -mt-5 ${i < currentIdx ? "bg-accent" : "bg-mist"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
