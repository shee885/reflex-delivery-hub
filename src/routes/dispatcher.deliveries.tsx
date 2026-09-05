import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageTitle } from "@/components/reflex/shell";
import {
  DeliveryFilters,
  DeliveryList,
  filterDeliveries,
} from "@/components/reflex/delivery-list";
import { DeliveryDetailDialog } from "@/components/reflex/delivery-detail";
import { useReflex } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";

export const Route = createFileRoute("/dispatcher/deliveries")({
  component: DispatcherDeliveries,
});

function DispatcherDeliveries() {
  const state = useReflex();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Delivery | null>(null);
  const list = filterDeliveries(state.deliveries, query, status);

  return (
    <>
      <PageTitle
        title="All deliveries"
        subtitle={`${list.length} of ${state.deliveries.length} deliveries`}
      />
      <DeliveryFilters query={query} onQuery={setQuery} status={status} onStatus={setStatus} />
      <DeliveryList deliveries={list} onSelect={setSelected} />
      <DeliveryDetailDialog
        delivery={selected}
        onOpenChange={(o) => !o && setSelected(null)}
        canAssign
      />
    </>
  );
}
