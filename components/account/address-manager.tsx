"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Star, Loader2, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NIGERIAN_STATES } from "@/lib/delivery";
import type { Address } from "@/types/database";
import { cn } from "@/lib/utils";

const empty = { full_name: "", phone: "", address: "", city: "", state: "" };

export function AddressManager() {
  const supabase = createClient();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setAddresses((data as Address[] | null) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("addresses").insert({ ...form, user_id: user.id, is_default: addresses.length === 0 });
      setForm(empty);
      setAdding(false);
      await load();
    }
    setSaving(false);
  }

  async function remove(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    await load();
  }

  async function makeDefault(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    await load();
  }

  const field = "w-full border border-black/15 rounded-[3px] px-3 py-2 text-sm outline-none focus:border-accent";

  if (loading) return <Loader2 className="animate-spin text-slate" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-xl">Addresses</h2>
        {!adding && (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-press">
            <Plus size={16} /> Add address
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={add} className="border border-black/[0.08] rounded-[5px] p-5 mb-6 grid sm:grid-cols-2 gap-3">
          <input required placeholder="Full name" value={form.full_name} onChange={set("full_name")} className={field} />
          <input required placeholder="Phone" value={form.phone} onChange={set("phone")} className={field} />
          <input required placeholder="Address" value={form.address} onChange={set("address")} className={cn(field, "sm:col-span-2")} />
          <input placeholder="City" value={form.city} onChange={set("city")} className={field} />
          <select required value={form.state} onChange={set("state")} className={field}>
            <option value="" disabled>State</option>
            {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : "Save address"}
            </button>
            <button type="button" onClick={() => { setAdding(false); setForm(empty); }} className="btn-ghost !text-ink !border-black/20">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="rounded-[5px] border border-dashed border-black/15 bg-mist/50 px-6 py-12 text-center">
          <MapPin size={28} className="mx-auto text-slate/50 mb-2" />
          <p className="text-sm text-slate">No saved addresses yet.</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <li key={a.id} className="border border-black/[0.08] rounded-[5px] p-4">
              <div className="flex items-start justify-between">
                <p className="font-medium text-sm">{a.full_name}</p>
                {a.is_default && <span className="eyebrow text-[0.55rem] bg-accent/15 text-accent-press px-1.5 py-0.5 rounded-[2px]">Default</span>}
              </div>
              <p className="text-sm text-slate mt-1">{a.address}</p>
              <p className="text-sm text-slate">{a.city ? `${a.city}, ` : ""}{a.state}</p>
              <p className="text-sm text-slate mt-0.5">{a.phone}</p>
              <div className="flex gap-3 mt-3 pt-3 border-t border-black/[0.06]">
                {!a.is_default && (
                  <button onClick={() => makeDefault(a.id)} className="inline-flex items-center gap-1 text-xs text-slate hover:text-accent-press">
                    <Star size={13} /> Set default
                  </button>
                )}
                <button onClick={() => remove(a.id)} className="inline-flex items-center gap-1 text-xs text-slate hover:text-red-600">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
