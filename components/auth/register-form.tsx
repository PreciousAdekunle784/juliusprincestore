"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "./auth-shell";
import { GoogleButton } from "./google-button";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) { setError("Passwords don’t match."); return; }
    if (form.password.length < 6) { setError("Use at least 6 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, phone: form.phone },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.session) { router.push("/account"); router.refresh(); return; }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <MailCheck size={34} className="mx-auto text-accent-press mb-3" />
        <p className="font-medium">Check your email</p>
        <p className="text-sm text-slate mt-1">We sent a confirmation link to {form.email}. Confirm it to finish creating your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-slate">
        <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input required placeholder="Full name" value={form.name} onChange={set("name")} className={authInput} />
        <input type="email" required placeholder="Email" value={form.email} onChange={set("email")} className={authInput} />
        <input required placeholder="Phone number" value={form.phone} onChange={set("phone")} className={authInput} />
        <div className="relative">
          <input type={show ? "text" : "password"} required placeholder="Password" value={form.password} onChange={set("password")} className={authInput} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <input type={show ? "text" : "password"} required placeholder="Confirm password" value={form.confirm} onChange={set("confirm")} className={authInput} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-60">
          {loading ? <><Loader2 size={17} className="animate-spin" /> Creating…</> : "Create account"}
        </button>
      </form>
    </div>
  );
}
