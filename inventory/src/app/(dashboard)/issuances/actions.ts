"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";

export type ActionState = { ok: boolean; error?: string };

const issueSchema = z.object({
  component_id: z.string().uuid("Pick a component."),
  quantity: z.coerce.number().int().positive("Quantity must be > 0."),
  issued_to_name: z.string().min(1, "Who is it issued to?"),
  issued_to_contact: z.string().optional(),
  purpose: z.string().optional(),
  event_id: z.string().uuid().optional().or(z.literal("")),
  due_date: z.string().optional(),
});

export async function issueComponent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = issueSchema.safeParse({
    component_id: formData.get("component_id"),
    quantity: formData.get("quantity"),
    issued_to_name: formData.get("issued_to_name"),
    issued_to_contact: formData.get("issued_to_contact") || undefined,
    purpose: formData.get("purpose") || undefined,
    event_id: formData.get("event_id") || "",
    due_date: formData.get("due_date") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };

  const { component_id, quantity, event_id, ...rest } = parsed.data;

  try {
    const db = await createClient();

    // guard against issuing more than available
    const { data: stock } = await db
      .from("component_stock")
      .select("available")
      .eq("id", component_id)
      .maybeSingle();
    const available = Number(stock?.available ?? 0);
    if (quantity > available) {
      return { ok: false, error: `Only ${available} available to issue.` };
    }

    const profile = await getProfile();
    const { error } = await db.from("issuances").insert({
      component_id,
      quantity,
      event_id: event_id || null,
      issued_by: profile?.id ?? null,
      status: "issued",
      ...rest,
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/issuances");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function markReturned(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const db = await createClient();
  await db
    .from("issuances")
    .update({ status: "returned", returned_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/issuances");
  revalidatePath("/");
}
