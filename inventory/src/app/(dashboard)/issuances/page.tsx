import { Undo2 } from "lucide-react";
import { PageTitle, Badge } from "@/components/ui";
import { getIssuances, getComponentOptions, getEventOptions } from "@/lib/queries";
import { fmtDate, isOverdue } from "@/lib/format";
import { IssueDialog } from "./issue-dialog";
import { markReturned } from "./actions";

export const dynamic = "force-dynamic";

export default async function IssuancesPage() {
  const [issuances, components, events] = await Promise.all([
    getIssuances(),
    getComponentOptions(),
    getEventOptions(),
  ]);

  const open = issuances.filter((i) => i.status !== "returned");
  const closed = issuances.filter((i) => i.status === "returned");

  return (
    <>
      <PageTitle
        title="Issue / Return"
        subtitle="Track who has what, and what's due back."
        action={<IssueDialog components={components} events={events} />}
      />

      <h2 className="mb-3 font-display text-lg font-bold">
        Outstanding <span className="text-muted">({open.length})</span>
      </h2>
      <div className="card mb-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Component</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Issued to</th>
              <th className="px-4 py-3 font-medium">Issued</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {open.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  Nothing is currently issued out.
                </td>
              </tr>
            ) : (
              open.map((i) => {
                const overdue = isOverdue(i.due_date, i.returned_at);
                return (
                  <tr key={i.id} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-medium">
                      {i.component?.name ?? "—"}
                      {i.purpose && (
                        <span className="block text-xs text-muted">{i.purpose}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{i.quantity}</td>
                    <td className="px-4 py-3">
                      {i.issued_to_name}
                      {i.issued_to_contact && (
                        <span className="block text-xs text-muted">{i.issued_to_contact}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(i.issued_at)}</td>
                    <td className={`whitespace-nowrap px-4 py-3 ${overdue ? "text-danger" : "text-muted"}`}>
                      {fmtDate(i.due_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={overdue ? "overdue" : i.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={markReturned}>
                        <input type="hidden" name="id" value={i.id} />
                        <button type="submit" className="btn btn-ghost px-3 py-1.5 text-xs">
                          <Undo2 size={14} /> Return
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {closed.length > 0 && (
        <>
          <h2 className="mb-3 font-display text-lg font-bold">
            Returned <span className="text-muted">({closed.length})</span>
          </h2>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Component</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Issued to</th>
                  <th className="px-4 py-3 font-medium">Returned</th>
                </tr>
              </thead>
              <tbody>
                {closed.map((i) => (
                  <tr key={i.id} className="border-b border-border last:border-0 opacity-75">
                    <td className="px-4 py-3">{i.component?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{i.quantity}</td>
                    <td className="px-4 py-3">{i.issued_to_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(i.returned_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
