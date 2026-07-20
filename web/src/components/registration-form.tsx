"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { registerForEvent, type RegisterState } from "@/app/events/[slug]/actions";

const initial: RegisterState = { ok: false };

export function RegistrationForm({ eventId }: { eventId: string }) {
  const [state, action, pending] = useActionState(registerForEvent, initial);

  const field =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary/50";

  if (state.ok) {
    return (
      <div className="card-glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={40} />
        <h3 className="mt-4 font-display text-xl font-bold">You&apos;re in! 🎉</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve saved your spot. Keep an eye on your email for details.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card-glass space-y-4 rounded-2xl p-7">
      <input type="hidden" name="eventId" value={eventId} />
      <h3 className="font-display text-xl font-bold">Register</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Full name *</label>
          <input required name="name" className={field} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Email *</label>
          <input required type="email" name="email" className={field} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
          <input name="phone" className={field} placeholder="+91…" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Student ID</label>
          <input name="student_id" className={field} placeholder="Roll no." />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Department</label>
          <input name="department" className={field} placeholder="e.g. Mechanical" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Year</label>
          <input name="year" className={field} placeholder="e.g. 2nd" />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">Anything else?</label>
        <textarea name="notes" rows={3} className={`${field} resize-none`} placeholder="Optional" />
      </div>

      {state.error && (
        <p className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={15} /> {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04180a] transition-shadow hover:shadow-[0_0_24px_var(--glow)] disabled:opacity-60"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? "Registering…" : "Reserve my spot"}
      </button>
    </form>
  );
}
