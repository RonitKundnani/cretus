import { PageTitle } from "@/components/ui";
import { getStock, getComponentOptions, getEventOptions } from "@/lib/queries";
import { getProfile } from "@/lib/auth";
import { ComponentsTable } from "./components-table";
import { AddComponentDialog } from "./add-component-dialog";
import { AddStockDialog } from "./add-stock-dialog";

export const dynamic = "force-dynamic";

export default async function ComponentsPage() {
  const [stock, components, events, profile] = await Promise.all([
    getStock(),
    getComponentOptions(),
    getEventOptions(),
    getProfile(),
  ]);

  return (
    <>
      <PageTitle
        title="Components"
        subtitle="Every part the club owns, with live availability."
        action={
          <div className="flex flex-wrap gap-3">
            <AddStockDialog components={components} events={events} />
            <AddComponentDialog />
          </div>
        }
      />
      <ComponentsTable rows={stock} isAdmin={profile?.role === "admin"} />
    </>
  );
}
