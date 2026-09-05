import { formatDistanceToNow } from "date-fns";
import { MapPin, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, PriorityBadge } from "./status-badge";
import { riderById, useReflex } from "@/lib/reflex/store";
import { STATUSES, type Delivery } from "@/lib/reflex/types";

export function DeliveryFilters({
  query,
  onQuery,
  status,
  onStatus,
}: {
  query: string;
  onQuery: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search order no, customer, address or item"
          className="bg-card pl-9"
        />
      </div>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="w-full bg-card sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function filterDeliveries(list: Delivery[], query: string, status: string) {
  const q = query.trim().toLowerCase();
  return list.filter((d) => {
    const okStatus = status === "all" || d.status === status;
    const okQuery =
      !q ||
      [d.orderNo, d.customerName, d.address, d.item, d.customerPhone]
        .join(" ")
        .toLowerCase()
        .includes(q);
    return okStatus && okQuery;
  });
}

export function DeliveryList({
  deliveries,
  onSelect,
  emptyLabel = "No deliveries match your filters.",
}: {
  deliveries: Delivery[];
  onSelect: (d: Delivery) => void;
  emptyLabel?: string;
}) {
  const state = useReflex();

  if (deliveries.length === 0) {
    return (
      <div className="card-elevated p-10 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {deliveries.map((d) => {
        const rider = riderById(state, d.riderId);
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d)}
            className="card-elevated w-full p-4 text-left transition-shadow hover:border-primary/40 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">{d.orderNo}</span>
              <StatusBadge status={d.status} />
              <PriorityBadge priority={d.priority} />
              <span className="ml-auto text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="mt-2 font-semibold">{d.customerName}</div>
            <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {d.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                {d.item}
              </span>
            </div>
            <div className="mt-2 text-xs font-medium">
              Rider:{" "}
              {rider ? (
                <span className="text-foreground">{rider.name}</span>
              ) : (
                <span className="text-accent-foreground">Unassigned</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "primary" | "secondary" | "accent" | "success" | "destructive";
}) {
  const tones: Record<string, string> = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent-foreground",
    success: "text-success",
    destructive: "text-destructive",
  };
  return (
    <div className="card-elevated p-4">
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className={`mt-1 text-3xl font-extrabold ${tones[tone]}`}>{value}</div>
    </div>
  );
}
