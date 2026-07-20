import { createClient } from "./supabase/server";
import type { Profile } from "./types";

/** The current user's profile (id, name, role) or null if not signed in. */
export async function getProfile(): Promise<Profile | null> {
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;

  const { data } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Fall back to a minimal profile if the row hasn't been created yet.
  return (
    data ?? {
      id: user.id,
      full_name: user.email ?? null,
      role: "committee",
      created_at: new Date().toISOString(),
    }
  );
}
