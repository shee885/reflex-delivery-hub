import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/reflex/shell";
import { RiderJobCard } from "@/components/reflex/rider-job";
import { StatCard } from "@/components/reflex/delivery-list";
import { useReflex, useSession } from "@/lib/reflex/store";

export const Route = createFileRoute("/rider/")({
  component: RiderDeliveries,
});

function RiderDeliveries() {
  const state = useReflex();
  const session = useSession();
  const riderId = session?.riderId ?? "d1";
  const mine = state.deliveries.filter((d) => d.riderId === riderId);
  const active = mine.filter((d) => ["Assigned", "Picked Up", "In Transit"].includes(d.status));
  const doneToday = mine.filter((d) => d.status === "Delivered").length;

  return (
    <>
      <PageTitle title="My deliveries" subtitle={session?.name ?? "Rider"} />
      <div className="mb-5 grid grid-cols-2 gap-3">
        <StatCard label="Active jobs" value={active.length} tone="primary" />
        <StatCard label="Delivered" value={doneToday} tone="success" />
      </div>

      <div className="grid gap-3">
        {active.length === 0 && (
          <div className="card-elevated p-10 text-center text-sm text-muted-foreground">
            No assigned deliveries right now. Dispatch will send jobs here.
          </div>
        )}
        {active.map((d) => (
          <RiderJobCard key={d.id} delivery={d} />
        ))}
      </div>
    </>
  );
}
