import { cn } from "@/lib/utils";
import type { DeliveryStatus, Priority } from "@/lib/reflex/types";

const styles: Record<DeliveryStatus, string> = {
  Pending: "bg-accent-soft text-accent-foreground border-accent/40",
  Assigned: "bg-secondary-soft text-secondary border-secondary/30",
  "Picked Up": "bg-secondary-soft text-secondary border-secondary/30",
  "In Transit": "bg-primary-soft text-primary border-primary/30",
  Delivered: "bg-success-soft text-success border-success/30",
  Failed: "bg-destructive-soft text-destructive border-destructive/30",
  Cancelled: "bg-destructive-soft text-destructive border-destructive/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: DeliveryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "Normal") {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Normal
      </span>
    );
  }
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-semibold",
        priority === "Urgent"
          ? "bg-destructive-soft text-destructive"
          : "bg-accent-soft text-accent-foreground",
      )}
    >
      {priority}
    </span>
  );
}
