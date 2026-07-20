import Link from "next/link";
import { Boxes, PackageCheck, ArrowRightLeft, TriangleAlert, Clock } from "lucide-react";
import { PageTitle, StatTile, Badge } from "@/components/ui";
import { getStock, getIssuances, getDamageReports } from "@/lib/queries";
import { fmtDate, isOverdue } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stock, issuances, damage] = await Promise.all([
    getStock(),
    getIssuances(),
    getDamageReports(),
  ]);

  const totalComponents = stock.length;
  const available = stock.reduce((s, c) => s + Number(c.available), 0);
  const issued = stock.reduce((s, c) => s + Number(c.total_issued), 0);
  const openIssuances = issuances.filter((i) => i.status !== "returned");
  const overdue = openIssuances.filter((i) => isOverdue(i.due_date, i.returned_at));
  const openDamage = damage.filter((d) => d.status !== "discarded" && d.status !== "repaired");

  const lowStock = stock
    .filter((c) => Number(c.available) <= 2)
    .sort((a, b) => Number(a.available) - Number(b.available))
    .slice(0, 5);

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Live snapshot of the club's inventory." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Components" value={totalComponents} icon={Boxes} href="/components" />
        <StatTile label="Units available" value={available} icon={PackageCheck} tone="primary" />
        <StatTile label="Currently issued" value={issued} icon={ArrowRightLeft} href="/issuances" />
        <StatTile
          label="Overdue returns"
          value={overdue.length}
          icon={Clock}
          tone={overdue.length ? "danger" : "default"}
          href="/issuances"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent issuances */}
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent activity</h2>
            <Link href="/issuances" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {issuances.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No issuances yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {issuances.slice(0, 6).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i.component?.name ?? "—"}{" "}
                      <span className="text-muted">×{i.quantity}</span>
                    </p>
                    <p className="truncate text-xs text-muted">
                      {i.issued_to_name} · {fmtDate(i.issued_at)}
                    </p>
                  </div>
                  <Badge
                    value={isOverdue(i.due_date, i.returned_at) ? "overdue" : i.status}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Alerts: low stock + open damage */}
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Needs attention</h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
                <TriangleAlert size={13} className="text-warn" /> Low stock
              </p>
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted">Everything's well-stocked.</p>
              ) : (
                <ul className="space-y-1.5">
                  {lowStock.map((c) => (
                    <li key={c.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{c.name}</span>
                      <span
                        className={`font-mono ${
                          Number(c.available) <= 0 ? "text-danger" : "text-warn"
                        }`}
                      >
                        {c.available} left
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
                <TriangleAlert size={13} className="text-danger" /> Open damage reports
              </p>
              <p className="text-sm">
                {openDamage.length === 0 ? (
                  <span className="text-muted">None open.</span>
                ) : (
                  <Link href="/damage" className="text-danger hover:underline">
                    {openDamage.length} unresolved
                  </Link>
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
