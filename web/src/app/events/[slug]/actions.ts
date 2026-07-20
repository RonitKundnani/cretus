"use server";

import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { isConfigured } from "@/lib/data";

const schema = z.object({
  eventId: z.string().uuid(),
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  student_id: z.string().optional(),
  department: z.string().optional(),
  year: z.string().optional(),
  notes: z.string().optional(),
});

export type RegisterState = {
  ok: boolean;
  error?: string;
};

export async function registerForEvent(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  if (!isConfigured()) {
    return { ok: false, error: "Registration isn't connected yet. Please email us." };
  }

  const parsed = schema.safeParse({
    eventId: formData.get("eventId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    student_id: formData.get("student_id") || undefined,
    department: formData.get("department") || undefined,
    year: formData.get("year") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { eventId, ...fields } = parsed.data;

  try {
    const db = createPublicClient();
    const { error } = await db.from("event_registrations").insert({
      event_id: eventId,
      ...fields,
    });
    if (error) {
      // RLS blocks registration when the event is closed / unpublished.
      return {
        ok: false,
        error:
          "Couldn't register — registration may be closed for this event.",
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
