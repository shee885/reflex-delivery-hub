import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Camera, CheckCircle2, MapPin, Navigation, Package, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge, PriorityBadge } from "./status-badge";
import { Timeline } from "./timeline";
import { confirmDelivery, setStatus } from "@/lib/reflex/store";
import type { Delivery, DeliveryStatus } from "@/lib/reflex/types";

const NEXT: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  Assigned: "Picked Up",
  "Picked Up": "In Transit",
};

export function RiderJobCard({ delivery }: { delivery: Delivery }) {
  const [confirming, setConfirming] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const next = NEXT[delivery.status];
  const done = ["Delivered", "Cancelled", "Failed"].includes(delivery.status);

  return (
    <div className="card-elevated p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-bold text-primary">{delivery.orderNo}</span>
        <StatusBadge status={delivery.status} />
        <PriorityBadge priority={delivery.priority} />
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(delivery.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="mt-3 text-lg font-bold">{delivery.customerName}</div>
      <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          {delivery.address}
        </div>
        <div className="flex items-start gap-2">
          <Package className="mt-0.5 h-4 w-4 shrink-0" />
          {delivery.item}
        </div>
        {delivery.notes && (
          <div className="rounded-lg bg-accent-soft p-2 text-xs font-medium text-accent-foreground">
            Note: {delivery.notes}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button asChild variant="outline" className="h-12">
          <a href={`tel:${delivery.customerPhone}`}>
            <Phone className="h-4 w-4" /> Call
          </a>
        </Button>
        <Button asChild variant="outline" className="h-12">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.address)}`}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation className="h-4 w-4" /> Navigate
          </a>
        </Button>
      </div>

      {!done && (
        <div className="mt-2 grid gap-2">
          {next && (
            <Button
              className="h-12"
              onClick={() => {
                setStatus(delivery.id, next, undefined, "Rider");
                toast.success(`Marked ${next}`);
              }}
            >
              Mark as {next}
            </Button>
          )}
          {delivery.status === "In Transit" && (
            <Button className="h-12 bg-success text-success-foreground hover:bg-success/90" onClick={() => setConfirming(true)}>
              <CheckCircle2 className="h-4 w-4" /> Confirm delivery
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => {
                setStatus(delivery.id, "Failed", "Marked failed by rider", "Rider");
                toast.error("Delivery marked failed");
              }}
            >
              Mark failed
            </Button>
            <Button variant="ghost" onClick={() => setShowTimeline(true)}>
              View timeline
            </Button>
          </div>
        </div>
      )}

      {done && (
        <Button variant="ghost" className="mt-2 w-full" onClick={() => setShowTimeline(true)}>
          View timeline
        </Button>
      )}

      <ConfirmDialog
        delivery={delivery}
        open={confirming}
        onOpenChange={setConfirming}
      />

      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono">{delivery.orderNo}</DialogTitle>
          </DialogHeader>
          <Timeline entries={delivery.timeline} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConfirmDialog({
  delivery,
  open,
  onOpenChange,
}: {
  delivery: Delivery;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [pin, setPin] = useState("");
  const [recipient, setRecipient] = useState(delivery.customerName);
  const [photo, setPhoto] = useState<string | undefined>();

  const onPhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proof of delivery — {delivery.orderNo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">4-digit customer PIN</Label>
            <Input
              id="pin"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              className="text-center font-mono text-2xl tracking-[0.5em]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient name</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Delivery photo (optional)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
            {photo && (
              <img src={photo} alt="Delivery proof" className="max-h-48 rounded-lg border object-cover" />
            )}
            {!photo && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Camera className="h-3.5 w-3.5" /> Take a photo at the drop-off point.
              </p>
            )}
          </div>
          <Button
            className="h-12 w-full bg-success text-success-foreground hover:bg-success/90"
            onClick={() => {
              const res = confirmDelivery(delivery.id, { pin, recipientName: recipient, photo });
              if (!res.ok) {
                toast.error(res.error ?? "Could not confirm");
                return;
              }
              toast.success(`${delivery.orderNo} delivered`);
              onOpenChange(false);
              setPin("");
            }}
          >
            Confirm as delivered
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo PIN for this order: <span className="font-mono font-bold">{delivery.pin}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
