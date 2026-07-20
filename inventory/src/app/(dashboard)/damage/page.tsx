import { Wrench, Trash2 } from "lucide-react";
import { PageTitle, Badge } from "@/components/ui";
import { getDamageReports, getComponentOptions } from "@/lib/queries";
import { fmtDate } from "@/lib/format";
import { ReportDamageDialog } from "./report-dialog";
import { resolveDamage } from "./actions";

export const dynamic = "force-dynamic";

export default async function DamagePage() {
  const [reports, components] = await Promise.all([
    getDamageReports(),
    getComponentOptions(),
  ]);

  const open = reports.filter((r) => r.status === "reported");
  const resolved = reports.filter((r) => r.status !== "reported");

  return (
    <>
      <PageTitle
        title="Damage log"
        subtitle="Report and resolve broken or lost components."
        action={<ReportDamageDialog components={components} />}
      />

      <div className="space-y-4">
        {reports.length === 0 && (
          <div className="card p-12 text-center text-sm text-muted">
            No damage reported. Long may it last. 🤞
          </div>
        )}

        {open.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{r.component?.name ?? "—"}</h3>
                  <span className="text-muted">×{r.quantity}</span>
                  <Badge value={r.severity} />
                </div>
                {r.description && (
                  <p className="mt-1.5 max-w-2xl text-sm text-muted">{r.description}</p>
                )}
                <p className="mt-1 font-mono text-xs text-muted">
                  Reported {fmtDate(r.reported_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={resolveDamage}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="repaired" />
                  <button className="btn btn-ghost px-3 py-1.5 text-xs">
                    <Wrench size={14} /> Mark repaired
                  </button>
                </form>
                <form action={resolveDamage}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value="discarded" />
                  <button className="btn btn-ghost px-3 py-1.5 text-xs hover:text-danger">
                    <Trash2 size={14} /> Discard
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {resolved.length > 0 && (
          <>
            <h2 className="mt-8 font-display text-lg font-bold">Resolved</h2>
            {resolved.map((r) => (
              <div key={r.id} className="card p-5 opacity-75">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{r.component?.name ?? "—"}</h3>
                  <span className="text-muted">×{r.quantity}</span>
                  <Badge value={r.status} />
                </div>
                {r.resolution && (
                  <p className="mt-1 text-sm text-muted">{r.resolution}</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
