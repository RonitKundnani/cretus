import { Receipt, FileText } from "lucide-react";
import { PageTitle, Badge } from "@/components/ui";
import { getAcquisitions } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { fmtDate, fmtMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AcquisitionsPage() {
  const acquisitions = await getAcquisitions();

  // Sign private bill images so committee can view them.
  const db = await createClient();
  const billUrls = new Map<string, string>();
  const paths = acquisitions
    .map((a) => a.bill_image_url)
    .filter((p): p is string => !!p);
  if (paths.length > 0) {
    const { data } = await db.storage.from("bills").createSignedUrls(paths, 3600);
    data?.forEach((s) => {
      if (s.signedUrl && s.path) billUrls.set(s.path, s.signedUrl);
    });
  }

  const totalSpent = acquisitions.reduce((s, a) => s + Number(a.total_cost ?? 0), 0);

  return (
    <>
      <PageTitle
        title="Purchases & Bills"
        subtitle="Every stock addition, with its bill, cost and reason."
      />

      <div className="mb-6 flex items-center gap-3 text-sm text-muted">
        <Receipt size={16} className="text-primary" />
        <span>
          {acquisitions.length} purchases · total spend{" "}
          <span className="font-mono text-primary">{fmtMoney(totalSpent)}</span>
        </span>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Component</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Reason / Event</th>
              <th className="px-4 py-3 font-medium">Bill</th>
            </tr>
          </thead>
          <tbody>
            {acquisitions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted">
                  No purchases logged yet. Add stock from the Components page.
                </td>
              </tr>
            ) : (
              acquisitions.map((a) => {
                const signed = a.bill_image_url ? billUrls.get(a.bill_image_url) : null;
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-2/40">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(a.purchased_on)}</td>
                    <td className="px-4 py-3 font-medium">{a.component?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right font-mono">{a.quantity}</td>
                    <td className="px-4 py-3 text-right font-mono">{fmtMoney(a.total_cost)}</td>
                    <td className="px-4 py-3 text-muted">{a.vendor ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="text-foreground/90">{a.reason ?? "—"}</div>
                      {a.event?.title && (
                        <div className="mt-1">
                          <Badge value={a.event.title} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {signed ? (
                        <a
                          href={signed}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <FileText size={14} /> View
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
