import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleShell } from "@/components/reflex/shell";

export const Route = createFileRoute("/dispatcher")({
  head: () => ({
    meta: [
      { title: "Dispatch control — Reflex" },
      {
        name: "description",
        content:
          "Assign riders, watch every job move from pending to delivered and keep your fleet balanced with the Reflex dispatch console.",
      },
      { property: "og:title", content: "Dispatch control — Reflex" },
      {
        property: "og:description",
        content: "Assign riders and track every delivery in one console.",
      },
    ],
  }),
  component: () => (
    <RoleShell
      role="dispatcher"
      nav={[
        { to: "/dispatcher", label: "Dashboard" },
        { to: "/dispatcher/deliveries", label: "Deliveries" },
        { to: "/dispatcher/riders", label: "Riders" },
      ]}
    >
      <Outlet />
    </RoleShell>
  ),
});
