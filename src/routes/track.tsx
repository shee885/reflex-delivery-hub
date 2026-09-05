import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { MapPin, PackageSearch, User } from "lucide-react";
import { ReflexLogo } from "@/components/reflex/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/reflex/status-badge";
import { Timeline } from "@/components/reflex/timeline";
import { lookupOrder, riderById, useReflex } from "@/lib/reflex/store";
import type { Delivery } from "@/lib/reflex/types";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your order — Reflex" },
      {
        name: "description",
        content:
          "Enter your Reflex order number, for example RFX-00125, to see the current status, rider, delivery address and full status timeline. No account needed.",
      },
      { property: "og:title", content: "Track your Reflex order" },
      {
        property: "og:description",
        content: "Enter an order number like RFX-00125 to follow your delivery in real time.",
      },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const state = useReflex();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Delivery | null>(null);
  const [error, setError] = useState("");

  const live = result ? (state.deliveries.find((d) => d.id === result.id) ?? result) : null;
  const rider = live ? riderById(state, live.riderId) : null;

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const found = lookupOrder(code);
    setResult(found);
    setError(found ? "" : `No delivery found for "${code.trim()}"`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link to="/">
            <ReflexLogo tagline />
          </Link>
          <Link to="/" className="text-sm font-semibold text-primary hover:underline">
            Staff sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Track your delivery</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the order number from your receipt or SMS, for example <strong>RFX-00125</strong>.
        </p>

        <form onSubmit={search} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="RFX-00125"
            className="bg-card font-mono sm:flex-1"
          />
          <Button type="submit">
            <PackageSearch className="h-4 w-4" /> Track order
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {live && (
          <div className="card-elevated mt-8 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg font-bold text-primary">{live.orderNo}</span>
              <StatusBadge status={live.status} />
            </div>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <Info icon={<User className="h-4 w-4" />} label="Customer" value={live.customerName} />
              <Info label="Item" value={live.item} />
              <Info
                icon={<MapPin className="h-4 w-4" />}
                label="Delivery address"
                value={live.address}
              />
              <Info label="Rider" value={rider ? `${rider.name} • ${rider.phone}` : "Not yet assigned"} />
              <Info
                label="Order placed"
                value={format(new Date(live.createdAt), "dd MMM yyyy • HH:mm")}
              />
              {live.pod && (
                <Info
                  label="Received by"
                  value={`${live.pod.recipientName} at ${format(new Date(live.pod.at), "HH:mm")}`}
                />
              )}
            </div>

            <div className="mt-8">
              <div className="mb-3 text-sm font-semibold">Status timeline</div>
              <Timeline entries={live.timeline} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/60 p-3">
      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2 font-medium">
        {icon}
        {value}
      </div>
    </div>
  );
}
