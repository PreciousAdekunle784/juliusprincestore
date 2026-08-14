import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request.
 *
 * This is defensive on purpose: middleware runs on every request, so if it ever
 * throws it takes down the ENTIRE site (MIDDLEWARE_INVOCATION_FAILED). If Supabase
 * isn't configured, or the auth refresh errors for any reason, we simply let the
 * request through instead of crashing. Pages handle their own auth/redirects.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet — don't crash; just serve the request.
  if (!url || !key) return response;

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Touch the session so it stays fresh.
    await supabase.auth.getUser();
  } catch {
    // Auth refresh failed — never let that take down every route.
    return NextResponse.next({ request });
  }

  return response;
}
