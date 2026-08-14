import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerCookieClient } from "@/lib/supabase/server";

/**
 * Service-role client — bypasses RLS. SERVER-ONLY. Use exclusively in trusted
 * server code (payment verification, marking orders paid, stock decrement).
 * Never import this into a Client Component.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Data client for admin server code (dashboard reads + server-action writes).
 * Prefers the service-role client so any authorized admin works — including
 * ones granted via the ADMIN_EMAILS allowlist who may not have role='admin' in
 * the database. Falls back to the cookie/RLS client when no service-role key is
 * set (works for database-role admins).
 *
 * SECURITY: callers MUST call requireAdmin() before using this.
 */
export function adminDb(): SupabaseClient {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return createAdminClient();
  return createServerCookieClient() as unknown as SupabaseClient;
}
