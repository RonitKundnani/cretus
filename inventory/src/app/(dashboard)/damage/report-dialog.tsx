"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/modal";
import { reportDamage, type ActionState } from "./actions";

const initial: ActionState = { ok: false };

export function ReportDamageDialog({
  components,
}: {
  components: { id: string; name: string }[];
}) {
  return (
    <Modal
      title="Report damage"
      trigger={(open) => (
        <button onClick={open} className="btn btn-primary">
          <TriangleAlert size={16} /> Report damage
        </button>
      )}
    >
      {(close) => <Form close={close} components={components} />}
    </Modal>
  );
}

function Form({
  close,
  components,
}: {
  close: () => void;
  components: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(reportDamage, initial);

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
          <label className="label">Severity *</label>
          <select name="severity" defaultValue="minor" className="input">
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="total">Total loss</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">What happened?</label>
        <textarea name="description" rows={3} className="input resize-none" placeholder="Describe the damage" />
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
          Submit report
        </button>
      </div>
    </form>
  );
}
