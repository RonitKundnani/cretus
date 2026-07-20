"use client";

import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui";
import { deleteComponent } from "./actions";
import type { ComponentStock } from "@/lib/types";

export function ComponentsTable({
  rows,
  isAdmin,
}: {
  rows: ComponentStock[];
  isAdmin: boolean;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        (r.category ?? "").toLowerCase().includes(s) ||
        (r.storage_location ?? "").toLowerCase().includes(s)
    );
  }, [rows, q]);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="relative max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search components…"
            className="input pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Component</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 text-right font-medium">Acquired</th>
              <th className="px-4 py-3 text-right font-medium">Issued</th>
              <th className="px-4 py-3 text-right font-medium">Available</th>
              {isAdmin && <th className="px-4 py-3" />}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-4 py-12 text-center text-muted">
                  {rows.length === 0 ? "No components yet — add one to get started." : "No matches."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const avail = Number(r.available);
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-muted">{r.category ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{r.storage_location ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.total_acquired}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.total_issued}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono font-semibold ${
                          avail <= 0 ? "text-danger" : avail <= 2 ? "text-warn" : "text-primary"
                        }`}
                      >
                        {avail}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <form action={deleteComponent}>
                          <input type="hidden" name="id" value={r.id} />
                          <button
                            type="submit"
                            aria-label={`Delete ${r.name}`}
                            className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <div className="border-t border-border px-4 py-3 text-xs text-muted">
          {filtered.length} of {rows.length} components ·{" "}
          <span className="text-primary">Available</span> = acquired − issued − discarded
        </div>
      )}
    </div>
  );
}
