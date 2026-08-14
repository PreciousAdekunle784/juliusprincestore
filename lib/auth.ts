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
  // Signed in but not an admin -> send home. Never redirect back to /login here:
  // a logged-in user gets bounced straight back, which is an infinite loop.
  if (!profile || profile.role !== "admin") redirect("/");
  return profile;
}
