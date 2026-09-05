import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/reflex/shell";
import { DeliveryList, StatCard } from "@/components/reflex/delivery-list";
import { DeliveryDetailDialog } from "@/components/reflex/delivery-detail";
import { useReflex } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";

export const Route = createFileRoute("/dispatcher/")({
  component: DispatcherDashboard,
});

function DispatcherDashboard() {
  const state = useReflex();
  const [selected, setSelected] = useState<Delivery | null>(null);
  const all = state.deliveries;
  const count = (s: string) => all.filter((d) => d.status === s).length;
  const unassigned = all.filter((d) => !d.riderId && d.status !== "Cancelled");

  return (
    <>
      <PageTitle title="Dispatch control" subtitle="Every delivery. Under control." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total" value={all.length} />
        <StatCard label="Pending" value={count("Pending")} tone="accent" />
        <StatCard label="Unassigned" value={unassigned.length} tone="destructive" />
        <StatCard label="In transit" value={count("In Transit")} tone="secondary" />
        <StatCard label="Delivered" value={count("Delivered")} tone="success" />
      </div>

      <h2 className="mt-8 mb-3 text-lg font-bold">Needs a rider</h2>
      <DeliveryList
        deliveries={unassigned}
        onSelect={setSelected}
        emptyLabel="Every delivery has a rider. Nice work."
      />

      <h2 className="mt-8 mb-3 text-lg font-bold">Active jobs</h2>
      <DeliveryList
        deliveries={all.filter((d) =>
          ["Assigned", "Picked Up", "In Transit"].includes(d.status),
        )}
        onSelect={setSelected}
        emptyLabel="No active jobs right now."
      />

      <DeliveryDetailDialog
        delivery={selected}
        onOpenChange={(o) => !o && setSelected(null)}
        canAssign
      />
    </>
  );
}
