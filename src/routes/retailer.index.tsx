import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PageTitle } from "@/components/reflex/shell";
import { DeliveryList, StatCard } from "@/components/reflex/delivery-list";
import { DeliveryDetailDialog } from "@/components/reflex/delivery-detail";
import { Button } from "@/components/ui/button";
import { useReflex, useSession } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";

export const Route = createFileRoute("/retailer/")({
  component: RetailerDashboard,
});

function RetailerDashboard() {
  const state = useReflex();
  const session = useSession();
  const [selected, setSelected] = useState<Delivery | null>(null);

  const mine = state.deliveries.filter((d) => d.retailerId === (session?.retailerId ?? "r1"));
  const count = (s: string) => mine.filter((d) => d.status === s).length;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageTitle
          title={`Hi, ${session?.name ?? "Retailer"}`}
          subtitle="Every delivery. Under control."
        />
        <Button asChild>
          <Link to="/retailer/new">
            <Plus className="h-4 w-4" /> New delivery
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={mine.length} tone="primary" />
        <StatCard label="Pending" value={count("Pending")} tone="accent" />
        <StatCard
          label="In transit"
          value={count("Picked Up") + count("In Transit") + count("Assigned")}
          tone="secondary"
        />
        <StatCard label="Delivered" value={count("Delivered")} tone="success" />
      </div>

      <h2 className="mt-8 mb-3 text-lg font-bold">Recent deliveries</h2>
      <DeliveryList
        deliveries={mine.slice(0, 6)}
        onSelect={setSelected}
        emptyLabel="No deliveries yet. Create your first request."
      />

      <DeliveryDetailDialog
        delivery={selected}
        onOpenChange={(o) => !o && setSelected(null)}
        canCancel
      />
    </>
  );
}
