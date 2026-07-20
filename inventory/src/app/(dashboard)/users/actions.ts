"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type ActionState = { ok: boolean; error?: string };

/** Guard: throws unless the caller is an admin. */
async function requireAdmin() {
  const profile = await getProfile();
  if (profile?.role !== "admin") throw new Error("Admins only.");
  return profile;
}

export async function setRole(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  const role = formData.get("role");
  if (typeof id !== "string" || (role !== "admin" && role !== "committee")) return;
  const db = await createClient();
  await db.from("profiles").update({ role }).eq("id", id); // RLS: admin only
  revalidatePath("/users");
}

const inviteSchema = z.object({
  full_name: z.string().min(1, "Name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.enum(["admin", "committee"]),
});

export async function inviteUser(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Admins only." };
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return {
      ok: false,
      error:
        "Set SUPABASE_SERVICE_ROLE_KEY in the environment to create accounts.",
    };
  }

  const parsed = inviteSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  try {
    const admin = createAdminClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await admin.auth.admin.createUser({
      email: parsed.data.email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.full_name },
    });
    if (error) return { ok: false, error: error.message };

    // trigger creates the profile; set the requested role.
    if (data.user) {
      await admin
        .from("profiles")
        .update({ role: parsed.data.role, full_name: parsed.data.full_name })
        .eq("id", data.user.id);
    }
    revalidatePath("/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}
