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

export const Route = createFileRoute("/retailer/deliveries")({
  component: RetailerDeliveries,
});

function RetailerDeliveries() {
  const state = useReflex();
  const session = useSession();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Delivery | null>(null);

  const mine = state.deliveries.filter((d) => d.retailerId === (session?.retailerId ?? "r1"));
  const list = filterDeliveries(mine, query, status);

  return (
    <>
      <PageTitle title="My deliveries" subtitle={`${list.length} of ${mine.length} deliveries`} />
      <DeliveryFilters query={query} onQuery={setQuery} status={status} onStatus={setStatus} />
      <DeliveryList deliveries={list} onSelect={setSelected} />
      <DeliveryDetailDialog
        delivery={selected}
        onOpenChange={(o) => !o && setSelected(null)}
        canCancel
      />
    </>
  );
}
