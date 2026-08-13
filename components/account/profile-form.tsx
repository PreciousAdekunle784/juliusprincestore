"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "@/components/auth/auth-shell";

export function ProfileForm() {
  const supabase = createClient();
  const [form, setForm] = useState({ full_name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).maybeSingle();
    setForm({ full_name: data?.full_name ?? "", phone: data?.phone ?? "", email: data?.email ?? user.email ?? "" });
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const set = (k: "full_name" | "phone") => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ full_name: form.full_name, phone: form.phone }).eq("id", user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  if (loading) return <Loader2 className="animate-spin text-slate" />;

  return (
    <form onSubmit={save} className="max-w-md space-y-3">
      <label className="block">
        <span className="eyebrow text-slate">Full name</span>
        <input value={form.full_name} onChange={set("full_name")} className={`${authInput} mt-1`} />
      </label>
      <label className="block">
        <span className="eyebrow text-slate">Phone</span>
        <input value={form.phone} onChange={set("phone")} className={`${authInput} mt-1`} />
      </label>
      <label className="block">
        <span className="eyebrow text-slate">Email</span>
        <input value={form.email} disabled className={`${authInput} mt-1 bg-mist text-slate cursor-not-allowed`} />
      </label>
      <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">
        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : saved ? <><Check size={16} /> Saved</> : "Save changes"}
      </button>
    </form>
  );
}
