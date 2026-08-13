"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { authInput } from "./auth-shell";
import { GoogleButton } from "./google-button";

export function LoginForm({ next = "/account" }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <GoogleButton next={next} />
      <div className="flex items-center gap-3 text-xs text-slate">
        <span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={authInput} />
        <div className="relative">
          <input type={show ? "text" : "password"} required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={authInput} />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-accent-press hover:underline">Forgot password?</Link>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-60">
          {loading ? <><Loader2 size={17} className="animate-spin" /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </div>
  );
}
