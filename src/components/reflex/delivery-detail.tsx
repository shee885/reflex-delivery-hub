import { format } from "date-fns";
import { MapPin, Package, Phone, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, PriorityBadge } from "./status-badge";
import { Timeline } from "./timeline";
import { QrCode } from "./qr";
import { assignRider, retailerName, riderById, setStatus, useReflex } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";
import { toast } from "sonner";

export function DeliveryDetailDialog({
  delivery,
  onOpenChange,
  canAssign = false,
  canCancel = false,
}: {
  delivery: Delivery | null;
  onOpenChange: (open: boolean) => void;
  canAssign?: boolean;
  canCancel?: boolean;
}) {
  const state = useReflex();
  const current = delivery ? (state.deliveries.find((d) => d.id === delivery.id) ?? delivery) : null;
  const rider = current ? riderById(state, current.riderId) : null;
  const closed =
    current?.status === "Delivered" ||
    current?.status === "Cancelled" ||
    current?.status === "Failed";

  return (
    <Dialog open={!!current} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {current && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-3">
                <span className="font-mono">{current.orderNo}</span>
                <StatusBadge status={current.status} />
                <PriorityBadge priority={current.priority} />
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
              <div className="space-y-3 text-sm">
                <Row icon={<User className="h-4 w-4" />} label="Customer" value={current.customerName} />
                <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={current.customerPhone} />
                <Row icon={<MapPin className="h-4 w-4" />} label="Address" value={current.address} />
                <Row icon={<Package className="h-4 w-4" />} label="Item" value={current.item} />
                {current.notes && <Row label="Notes" value={current.notes} />}
                <Row label="Retailer" value={retailerName(current.retailerId)} />
                <Row label="Rider" value={rider ? `${rider.name} • ${rider.phone}` : "Unassigned"} />
                <Row
                  label="Created"
                  value={format(new Date(current.createdAt), "dd MMM yyyy • HH:mm")}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <QrCode value={current.orderNo} size={150} />
                <span className="text-xs text-muted-foreground">Scan to open order</span>
              </div>
            </div>

            {canAssign && (
              <div className="rounded-xl border bg-muted/40 p-4">
                <div className="mb-2 text-sm font-semibold">
                  {current.riderId ? "Reassign rider" : "Assign rider"}
                </div>
                <Select
                  value={current.riderId ?? undefined}
                  disabled={closed}
                  onValueChange={(v) => {
                    assignRider(current.id, v);
                    toast.success("Rider assigned");
                  }}
                >
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue placeholder="Choose a rider" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.riders.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} — {r.available ? "Available" : "Busy"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {canCancel && !closed && (
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => {
                  setStatus(current.id, "Cancelled", "Cancelled by retailer");
                  toast.success("Delivery cancelled");
                }}
              >
                Cancel delivery
              </Button>
            )}

            {current.pod && (
              <div className="rounded-xl border border-success/30 bg-success-soft p-4">
                <div className="text-sm font-semibold text-success">Proof of delivery</div>
                <p className="mt-1 text-sm">
                  Received by <strong>{current.pod.recipientName}</strong> on{" "}
                  {format(new Date(current.pod.at), "dd MMM yyyy • HH:mm")}
                </p>
                {current.pod.photo && (
                  <img
                    src={current.pod.photo}
                    alt="Delivery proof"
                    className="mt-3 max-h-56 rounded-lg border object-cover"
                  />
                )}
              </div>
            )}

            <div>
              <div className="mb-3 text-sm font-semibold">Status timeline</div>
              <Timeline entries={current.timeline} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 w-24 shrink-0 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="flex items-start gap-2 font-medium">
        {icon}
        {value}
      </span>
    </div>
  );
}
