import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleShell } from "@/components/reflex/shell";

export const Route = createFileRoute("/rider")({
  head: () => ({
    meta: [
      { title: "Rider app — Reflex" },
      {
        name: "description",
        content:
          "Riders see assigned deliveries, call customers, navigate, update status and confirm drop-off with a customer PIN and photo.",
      },
      { property: "og:title", content: "Rider app — Reflex" },
      {
        property: "og:description",
        content: "Assigned jobs, one-tap calling, navigation and PIN-confirmed delivery.",
      },
    ],
  }),
  component: () => (
    <RoleShell
      role="rider"
      nav={[
        { to: "/rider", label: "My Deliveries" },
        { to: "/rider/scan", label: "Scan Order" },
        { to: "/rider/history", label: "History" },
      ]}
    >
      <Outlet />
    </RoleShell>
  ),
});
