"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/modal";
import { addAcquisition, type ActionState } from "./actions";
import type { EventOption } from "@/lib/types";

const initial: ActionState = { ok: false };

export function AddStockDialog({
  components,
  events,
  presetComponentId,
  label = "Add stock",
}: {
  components: { id: string; name: string }[];
  events: EventOption[];
  presetComponentId?: string;
  label?: string;
}) {
  return (
    <Modal
      title="Add stock (with bill)"
      trigger={(open) => (
        <button onClick={open} className="btn btn-ghost">
          <PackagePlus size={16} /> {label}
        </button>
      )}
    >
      {(close) => (
        <Form
          close={close}
          components={components}
          events={events}
          presetComponentId={presetComponentId}
        />
      )}
    </Modal>
  );
}

function Form({
  close,
  components,
  events,
  presetComponentId,
}: {
  close: () => void;
  components: { id: string; name: string }[];
  events: EventOption[];
  presetComponentId?: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(addAcquisition, initial);

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
        <select
          name="component_id"
          required
          defaultValue={presetComponentId ?? ""}
          className="input"
        >
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Quantity *</label>
          <input name="quantity" type="number" min={1} required className="input" placeholder="10" />
        </div>
        <div>
          <label className="label">Unit cost (₹)</label>
          <input name="unit_cost" type="number" min={0} step="0.01" className="input" placeholder="450" />
        </div>
        <div>
          <label className="label">Purchased on</label>
          <input name="purchased_on" type="date" className="input" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Vendor</label>
          <input name="vendor" className="input" placeholder="e.g. Robu.in" />
        </div>
        <div>
          <label className="label">For event (optional)</label>
          <select name="event_id" defaultValue="" className="input">
            <option value="">— General stock —</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Reason / purpose</label>
        <input name="reason" className="input" placeholder="e.g. For RoboWars 2026 build" />
      </div>

      <div>
        <label className="label">Bill / invoice (image or PDF)</label>
        <input name="bill" type="file" accept="image/*,application/pdf" className="input" />
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
          Add stock
        </button>
      </div>
    </form>
  );
}
