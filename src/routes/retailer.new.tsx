import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { PageTitle } from "@/components/reflex/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode } from "@/components/reflex/qr";
import { createDelivery, useSession } from "@/lib/reflex/store";
import type { Priority } from "@/lib/reflex/types";

export const Route = createFileRoute("/retailer/new")({
  component: NewDelivery,
});

const schema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required").max(80),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+254\d{9}$/, "Use the +254 format, e.g. +254712345678"),
  address: z.string().trim().min(5, "Delivery address is required").max(200),
  item: z.string().trim().min(2, "Describe the item").max(160),
  notes: z.string().trim().max(300).optional(),
});

function NewDelivery() {
  const session = useSession();
  const navigate = useNavigate();
  const [priority, setPriority] = useState<Priority>("Normal");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [created, setCreated] = useState<{ orderNo: string; pin: string } | null>(null);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = {
      customerName: String(form.get("customerName") ?? ""),
      customerPhone: String(form.get("customerPhone") ?? ""),
      address: String(form.get("address") ?? ""),
      item: String(form.get("item") ?? ""),
      notes: String(form.get("notes") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const d = createDelivery({
      retailerId: session?.retailerId ?? "r1",
      ...parsed.data,
      notes: parsed.data.notes || undefined,
      priority,
    });
    toast.success(`${d.orderNo} sent to dispatch`);
    setCreated({ orderNo: d.orderNo, pin: d.pin });
    e.currentTarget.reset();
  };

  if (created) {
    return (
      <>
        <PageTitle title="Delivery request created" subtitle="Dispatch can now assign a rider." />
        <div className="card-elevated flex flex-col items-center gap-4 p-8 text-center">
          <QrCode value={created.orderNo} size={180} />
          <div className="font-mono text-2xl font-extrabold text-primary">{created.orderNo}</div>
          <p className="text-sm text-muted-foreground">
            Share this customer PIN for confirmation on arrival:
          </p>
          <div className="rounded-xl bg-accent-soft px-6 py-3 font-mono text-3xl font-extrabold tracking-widest">
            {created.pin}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={() => setCreated(null)}>Create another</Button>
            <Button variant="outline" onClick={() => void navigate({ to: "/retailer/deliveries" })}>
              View all deliveries
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="New delivery" subtitle="Send a request straight to dispatch." />
      <form onSubmit={submit} className="card-elevated max-w-2xl space-y-5 p-6">
        <Field label="Customer name" error={errors["customerName"]}>
          <Input name="customerName" placeholder="Mercy Wanjiru" maxLength={80} />
        </Field>
        <Field label="Customer phone" error={errors["customerPhone"]}>
          <Input name="customerPhone" placeholder="+254712345678" defaultValue="+254" />
        </Field>
        <Field label="Delivery address" error={errors["address"]}>
          <Input name="address" placeholder="Westlands, Sarit Centre, Nairobi" maxLength={200} />
        </Field>
        <Field label="Item description" error={errors["item"]}>
          <Input name="item" placeholder="Samsung A15 phone + case" maxLength={160} />
        </Field>
        <Field label="Notes (optional)" error={errors["notes"]}>
          <Textarea name="notes" placeholder="Call before arriving, gate code…" maxLength={300} />
        </Field>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="Urgent">Urgent</SelectItem>
              <SelectItem value="Express">Express</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Create delivery request
        </Button>
      </form>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
