import { createFileRoute } from "@tanstack/react-router";
import { Bike, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/reflex/shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/reflex/status-badge";
import { toggleRiderAvailability, useReflex } from "@/lib/reflex/store";

export const Route = createFileRoute("/dispatcher/riders")({
  component: RidersPage,
});

function RidersPage() {
  const state = useReflex();

  return (
    <>
      <PageTitle title="Riders" subtitle="Availability and current workload." />
      <div className="grid gap-3 md:grid-cols-2">
        {state.riders.map((rider) => {
          const jobs = state.deliveries.filter(
            (d) =>
              d.riderId === rider.id && ["Assigned", "Picked Up", "In Transit"].includes(d.status),
          );
          const done = state.deliveries.filter(
            (d) => d.riderId === rider.id && d.status === "Delivered",
          ).length;
          return (
            <div key={rider.id} className="card-elevated p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold">{rider.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Bike className="h-4 w-4" /> {rider.vehicle}
                  </div>
                  <a
                    href={`tel:${rider.phone}`}
                    className="mt-1 flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  >
                    <Phone className="h-4 w-4" /> {rider.phone}
                  </a>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    rider.available
                      ? "bg-success-soft text-success"
                      : "bg-destructive-soft text-destructive"
                  }`}
                >
                  {rider.available ? "Available" : "Busy"}
                </span>
              </div>

              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <div className="text-2xl font-extrabold text-primary">{jobs.length}</div>
                  <div className="text-xs text-muted-foreground">Active jobs</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-success">{done}</div>
                  <div className="text-xs text-muted-foreground">Delivered</div>
                </div>
              </div>

              {jobs.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {jobs.map((j) => (
                    <li
                      key={j.id}
                      className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2 text-sm"
                    >
                      <span className="font-mono font-semibold">{j.orderNo}</span>
                      <StatusBadge status={j.status} />
                    </li>
                  ))}
                </ul>
              )}

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  toggleRiderAvailability(rider.id);
                  toast.success(`${rider.name} marked ${rider.available ? "busy" : "available"}`);
                }}
              >
                Mark {rider.available ? "busy" : "available"}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}
