"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type ActionState = { ok: boolean; error?: string };

const reportSchema = z.object({
  component_id: z.string().uuid("Pick a component."),
  quantity: z.coerce.number().int().positive("Quantity must be > 0."),
  severity: z.enum(["minor", "major", "total"]),
  description: z.string().optional(),
});

export async function reportDamage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = reportSchema.safeParse({
    component_id: formData.get("component_id"),
    quantity: formData.get("quantity"),
    severity: formData.get("severity"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  try {
    const db = await createClient();
    const profile = await getProfile();

    let image_url: string | null = null;
    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const path = `damage/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await db.storage
        .from("component-images")
        .upload(path, file, { contentType: file.type || undefined });
      if (upErr) return { ok: false, error: upErr.message };
      image_url = db.storage.from("component-images").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await db.from("damage_reports").insert({
      ...parsed.data,
      image_url,
      reported_by: profile?.id ?? null,
      status: "reported",
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/damage");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function resolveDamage(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || (status !== "repaired" && status !== "discarded"))
    return;
  const resolution = (formData.get("resolution") as string) || null;
  const db = await createClient();
  await db.from("damage_reports").update({ status, resolution }).eq("id", id);
  revalidatePath("/damage");
  revalidatePath("/");
}
