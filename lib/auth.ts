import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export const getSessionUser = cache(async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile | null) ?? null;
});

/** Emails granted admin via env (comma-separated), e.g. ADMIN_EMAILS="me@x.com,you@y.com". */
function adminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the signed-in user is an admin — by database role OR by ADMIN_EMAILS. */
export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  if (!user) return false;
  const profile = await getProfile();
  if (profile?.role === "admin") return true;
  return user.email ? adminEmailAllowlist().includes(user.email.toLowerCase()) : false;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<Profile> {
  const user = await getSessionUser();
  // Not signed in at all -> go authenticate, then come back to /admin.
  if (!user) redirect("/login?next=/admin");

  const profile = await getProfile();
  const allowlisted = user.email ? adminEmailAllowlist().includes(user.email.toLowerCase()) : false;

  // Signed in but not an admin -> send home. Never redirect back to /login here:
  // a logged-in user gets bounced straight back, which is an infinite loop.
  if (profile?.role !== "admin" && !allowlisted) redirect("/");

  // An allowlisted admin might not have a profile row yet — synthesize one.
  return (
    profile ??
    ({
      id: user.id,
      email: user.email ?? null,
      full_name: null,
      phone: null,
      role: "admin",
      created_at: new Date().toISOString(),
    } as Profile)
  );
}
