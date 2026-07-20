"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type ActionState = { ok: boolean; error?: string };

/** Uploads a File to a bucket, returns the stored reference (path or public URL). */
async function uploadFile(
  db: Awaited<ReturnType<typeof createClient>>,
  bucket: "bills" | "component-images",
  file: File | null,
  isPublic: boolean
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  if (isPublic) {
    return db.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  return path; // private bucket — store path, sign on read
}

const componentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  category: z.string().optional(),
  description: z.string().optional(),
  storage_location: z.string().optional(),
});

export async function createComponent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = componentSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
    storage_location: formData.get("storage_location") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const db = await createClient();
    const image_url = await uploadFile(
      db,
      "component-images",
      formData.get("image") as File | null,
      true
    );
    const { error } = await db
      .from("components")
      .insert({ ...parsed.data, image_url });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/components");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

const acquisitionSchema = z.object({
  component_id: z.string().uuid("Pick a component."),
  quantity: z.coerce.number().int().positive("Quantity must be > 0."),
  unit_cost: z.coerce.number().nonnegative().optional(),
  vendor: z.string().optional(),
  purchased_on: z.string().optional(),
  reason: z.string().optional(),
  event_id: z.string().uuid().optional().or(z.literal("")),
});

export async function addAcquisition(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = acquisitionSchema.safeParse({
    component_id: formData.get("component_id"),
    quantity: formData.get("quantity"),
    unit_cost: formData.get("unit_cost") || undefined,
    vendor: formData.get("vendor") || undefined,
    purchased_on: formData.get("purchased_on") || undefined,
    reason: formData.get("reason") || undefined,
    event_id: formData.get("event_id") || "",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const { unit_cost, quantity, event_id, ...rest } = parsed.data;
  const total_cost = unit_cost != null ? unit_cost * quantity : null;

  try {
    const db = await createClient();
    const profile = await getProfile();
    const bill_image_url = await uploadFile(
      db,
      "bills",
      formData.get("bill") as File | null,
      false
    );
    const { error } = await db.from("acquisitions").insert({
      ...rest,
      quantity,
      unit_cost: unit_cost ?? null,
      total_cost,
      event_id: event_id || null,
      bill_image_url,
      added_by: profile?.id ?? null,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/components");
    revalidatePath("/acquisitions");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function deleteComponent(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const db = await createClient();
  await db.from("components").delete().eq("id", id); // RLS: admin only
  revalidatePath("/components");
}
