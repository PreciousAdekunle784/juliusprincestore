"use client";

import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "./auth-shell";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <MailCheck size={34} className="mx-auto text-accent-press mb-3" />
        <p className="font-medium">Check your email</p>
        <p className="text-sm text-slate mt-1">If an account exists for {email}, a reset link is on its way.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={authInput} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-60">
        {loading ? <><Loader2 size={17} className="animate-spin" /> Sending…</> : "Send reset link"}
      </button>
    </form>
  );
}
