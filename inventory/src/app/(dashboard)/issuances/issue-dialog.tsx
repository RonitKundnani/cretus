"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/modal";
import { issueComponent, type ActionState } from "./actions";
import type { EventOption } from "@/lib/types";

const initial: ActionState = { ok: false };

export function IssueDialog({
  components,
  events,
}: {
  components: { id: string; name: string }[];
  events: EventOption[];
}) {
  return (
    <Modal
      title="Issue a component"
      trigger={(open) => (
        <button onClick={open} className="btn btn-primary">
          <ArrowUpRight size={16} /> Issue component
        </button>
      )}
    >
      {(close) => <Form close={close} components={components} events={events} />}
    </Modal>
  );
}

function Form({
  close,
  components,
  events,
}: {
  close: () => void;
  components: { id: string; name: string }[];
  events: EventOption[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(issueComponent, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      close();
    }
  }, [state.ok, router, close]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label">Component *</label>
        <select name="component_id" required defaultValue="" className="input">
          <option value="" disabled>
            Select a component…
          </option>
          {components.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Quantity *</label>
          <input name="quantity" type="number" min={1} required className="input" placeholder="1" />
        </div>
        <div>
          <label className="label">Due back by</label>
          <input name="due_date" type="date" className="input" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Issued to *</label>
          <input name="issued_to_name" required className="input" placeholder="Person's name" />
        </div>
        <div>
          <label className="label">Contact</label>
          <input name="issued_to_contact" className="input" placeholder="Phone / email" />
        </div>
      </div>

      <div>
        <label className="label">For event (optional)</label>
        <select name="event_id" defaultValue="" className="input">
          <option value="">— Not event-specific —</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.type})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Purpose</label>
        <input name="purpose" className="input" placeholder="e.g. Line-follower build" />
      </div>

      {state.error && (
        <p className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle size={15} /> {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={close} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending && <Loader2 size={16} className="animate-spin" />}
          Issue
        </button>
      </div>
    </form>
  );
}
