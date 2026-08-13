import { getCustomers } from "@/lib/admin";

export default async function AdminCustomers() {
  const customers = await getCustomers();
  return (
    <div className="space-y-6">
      <h1 className="font-display font-extrabold text-2xl tracking-tight">Customers</h1>
      {customers.length === 0 ? (
        <p className="text-sm text-slate bg-paper border border-black/[0.07] rounded-[5px] p-6">No customers yet.</p>
      ) : (
        <div className="bg-paper border border-black/[0.07] rounded-[5px] divide-y divide-black/[0.06]">
          {customers.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.full_name ?? "—"}</p>
                <p className="text-xs text-slate truncate">{c.email} · {c.phone ?? "no phone"}</p>
              </div>
              {c.role === "admin" && <span className="eyebrow text-[0.55rem] bg-ink text-paper px-1.5 py-0.5 rounded-[2px]">Admin</span>}
              <span className="text-xs text-slate hidden sm:block">{new Date(c.created_at).toLocaleDateString("en-NG")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
