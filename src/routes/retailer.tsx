import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleShell } from "@/components/reflex/shell";

export const Route = createFileRoute("/retailer")({
  head: () => ({
    meta: [
      { title: "Retailer workspace — Reflex" },
      {
        name: "description",
        content: "Raise delivery requests and follow every order your shop sends out with Reflex.",
      },
      { property: "og:title", content: "Retailer workspace — Reflex" },
      {
        property: "og:description",
        content: "Create deliveries, see assigned riders and view proof of delivery.",
      },
    ],
  }),
  component: () => (
    <RoleShell
      role="retailer"
      nav={[
        { to: "/retailer", label: "Dashboard" },
        { to: "/retailer/new", label: "New Delivery" },
        { to: "/retailer/deliveries", label: "Deliveries" },
      ]}
    >
      <Outlet />
    </RoleShell>
  ),
});
