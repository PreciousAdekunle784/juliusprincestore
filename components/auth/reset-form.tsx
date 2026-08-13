"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "./auth-shell";

export function ResetForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Passwords don’t match."); return; }
    if (password.length < 6) { setError("Use at least 6 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="relative">
        <input type={show ? "text" : "password"} required placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className={authInput} />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate" aria-label={show ? "Hide" : "Show"}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <input type={show ? "text" : "password"} required placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={authInput} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-60">
        {loading ? <><Loader2 size={17} className="animate-spin" /> Saving…</> : "Set new password"}
      </button>
    </form>
  );
}
