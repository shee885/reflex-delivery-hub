import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/reflex/shell";
import {
  DeliveryFilters,
  DeliveryList,
  filterDeliveries,
} from "@/components/reflex/delivery-list";
import { DeliveryDetailDialog } from "@/components/reflex/delivery-detail";
import { useReflex, useSession } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";

export const Route = createFileRoute("/rider/history")({
  component: RiderHistory,
});

function RiderHistory() {
  const state = useReflex();
  const session = useSession();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Delivery | null>(null);

  const riderId = session?.riderId ?? "d1";
  const past = state.deliveries.filter(
    (d) => d.riderId === riderId && ["Delivered", "Failed", "Cancelled"].includes(d.status),
  );
  const list = filterDeliveries(past, query, status);

  return (
    <>
      <PageTitle title="History" subtitle={`${past.length} completed jobs`} />
      <DeliveryFilters query={query} onQuery={setQuery} status={status} onStatus={setStatus} />
      <DeliveryList
        deliveries={list}
        onSelect={setSelected}
        emptyLabel="No completed jobs yet."
      />
      <DeliveryDetailDialog delivery={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </>
  );
}
