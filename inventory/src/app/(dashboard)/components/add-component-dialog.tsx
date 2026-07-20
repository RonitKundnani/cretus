"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/modal";
import { createComponent, type ActionState } from "./actions";

const initial: ActionState = { ok: false };

export function AddComponentDialog() {
  return (
    <Modal
      title="Add a component"
      trigger={(open) => (
        <button onClick={open} className="btn btn-primary">
          <Plus size={16} /> Add component
        </button>
      )}
    >
      {(close) => <Form close={close} />}
    </Modal>
  );
}

function Form({ close }: { close: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createComponent, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      close();
    }
  }, [state.ok, router, close]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label">Name *</label>
        <input name="name" required className="input" placeholder="e.g. Arduino Uno R3" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input name="category" className="input" placeholder="e.g. Microcontroller" />
        </div>
        <div>
          <label className="label">Storage location</label>
          <input name="storage_location" className="input" placeholder="e.g. Cabinet A - Shelf 1" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea name="description" rows={2} className="input resize-none" placeholder="Optional notes" />
      </div>
      <div>
        <label className="label">Photo (optional)</label>
        <input name="image" type="file" accept="image/*" className="input" />
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
          Save component
        </button>
      </div>
    </form>
  );
}
