"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import { Modal } from "@/components/modal";
import { inviteUser, type ActionState } from "./actions";

const initial: ActionState = { ok: false };

export function InviteDialog() {
  return (
    <Modal
      title="Add a committee account"
      trigger={(open) => (
        <button onClick={open} className="btn btn-primary">
          <UserPlus size={16} /> Add user
        </button>
      )}
    >
      {(close) => <Form close={close} />}
    </Modal>
  );
}

function Form({ close }: { close: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(inviteUser, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      close();
    }
  }, [state.ok, router, close]);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label">Full name *</label>
        <input name="full_name" required className="input" placeholder="Member name" />
      </div>
      <div>
        <label className="label">Email *</label>
        <input name="email" type="email" required className="input" placeholder="member@pdpu.ac.in" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Temp password *</label>
          <input name="password" required minLength={6} className="input" placeholder="min 6 chars" />
        </div>
        <div>
          <label className="label">Role *</label>
          <select name="role" defaultValue="committee" className="input">
            <option value="committee">Committee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-muted">
        The member signs in with this email &amp; password, then can change it.
      </p>

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
          Create account
        </button>
      </div>
    </form>
  );
}
