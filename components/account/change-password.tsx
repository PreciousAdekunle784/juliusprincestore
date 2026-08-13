"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "@/components/auth/auth-shell";

export function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords don’t match."); return; }
    if (password.length < 6) { setError("Use at least 6 characters."); return; }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setSaving(false); return; }
    setDone(true);
    setPassword(""); setConfirm("");
    setSaving(false);
    setTimeout(() => setDone(false), 2500);
  }

  return (
    <form onSubmit={save} className="max-w-md space-y-3">
      <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className={authInput} />
      <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={authInput} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="btn-accent disabled:opacity-60">
        {saving ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : done ? <><Check size={16} /> Updated</> : "Change password"}
      </button>
    </form>
  );
}
