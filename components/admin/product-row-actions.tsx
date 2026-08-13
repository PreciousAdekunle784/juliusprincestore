"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toggleProductActive, deleteProduct } from "@/app/admin/actions";

export function ProductRowActions({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(active);
  const [, startTransition] = useTransition();

  function toggle() {
    const next = !isActive;
    setIsActive(next);
    startTransition(() => { void toggleProductActive(id, next); });
  }

  async function remove() {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={toggle}
        role="switch"
        aria-checked={isActive}
        className={`relative h-5 w-9 rounded-full transition-colors ${isActive ? "bg-accent" : "bg-black/20"}`}
        title={isActive ? "Active" : "Hidden"}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${isActive ? "left-4" : "left-0.5"}`} />
      </button>
      <Link href={`/admin/products/${id}`} className="grid place-items-center h-8 w-8 rounded-[3px] border border-black/15 text-slate hover:text-ink hover:border-ink" aria-label="Edit">
        <Pencil size={15} />
      </Link>
      <button onClick={remove} className="grid place-items-center h-8 w-8 rounded-[3px] border border-black/15 text-slate hover:text-red-600 hover:border-red-300" aria-label="Delete">
        <Trash2 size={15} />
      </button>
    </div>
  );
}
