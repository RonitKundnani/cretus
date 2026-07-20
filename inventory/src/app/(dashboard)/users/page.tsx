import { redirect } from "next/navigation";
import { PageTitle, Badge } from "@/components/ui";
import { getProfiles } from "@/lib/queries";
import { getProfile } from "@/lib/auth";
import { fmtDate } from "@/lib/format";
import { InviteDialog } from "./invite-dialog";
import { setRole } from "./actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await getProfile();
  if (me?.role !== "admin") redirect("/");

  const profiles = await getProfiles();

  return (
    <>
      <PageTitle
        title="Users"
        subtitle="Committee accounts and their roles."
        action={<InviteDialog />}
      />

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Change role</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                <td className="px-4 py-3 font-medium">
                  {p.full_name ?? "—"}
                  {p.id === me.id && <span className="ml-2 text-xs text-muted">(you)</span>}
                </td>
                <td className="px-4 py-3">
                  <Badge value={p.role} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(p.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  {p.id === me.id ? (
                    <span className="text-xs text-muted">—</span>
                  ) : (
                    <form action={setRole} className="inline-flex items-center gap-2">
                      <input type="hidden" name="id" value={p.id} />
                      <select
                        name="role"
                        defaultValue={p.role}
                        className="input w-auto py-1.5 text-xs"
                      >
                        <option value="committee">Committee</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="btn btn-ghost px-3 py-1.5 text-xs">
                        Save
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
