import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free Supabase client for reading PUBLIC content (projects, blog,
 * events, committee...).
 *
 * The public site has no logged-in users, so it must NOT use the cookie-based
 * server client: touching `cookies()` opts every page into dynamic rendering
 * and breaks static generation / ISR.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
