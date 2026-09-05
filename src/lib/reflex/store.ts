import { useSyncExternalStore } from "react";
import { buildSeedDeliveries, NEXT_SEQ, RETAILERS, SEED_RIDERS, orderNo } from "./seed";
import type { Delivery, DeliveryStatus, Priority, Rider, Session } from "./types";

const KEY = "reflex.state.v1";
const SESSION_KEY = "reflex.session.v1";

export type ReflexState = {
  deliveries: Delivery[];
  riders: Rider[];
  seq: number;
};

const initial = (): ReflexState => ({
  deliveries: buildSeedDeliveries(),
  riders: SEED_RIDERS,
  seq: NEXT_SEQ,
});

let state: ReflexState = initial();
let session: Session | null = null;
let hydrated = false;

const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw) as ReflexState;
    else localStorage.setItem(KEY, JSON.stringify(state));
    const s = localStorage.getItem(SESSION_KEY);
    session = s ? (JSON.parse(s) as Session) : null;
  } catch {
    /* ignore */
  }
  try {
    channel = new BroadcastChannel("reflex");
    channel.onmessage = () => {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        state = JSON.parse(raw) as ReflexState;
        emit();
      }
    };
  } catch {
    /* ignore */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === KEY && e.newValue) {
      state = JSON.parse(e.newValue) as ReflexState;
      emit();
    }
  });
}

function commit(next: ReflexState) {
  state = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
    channel?.postMessage("update");
  }
  emit();
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const serverState = initial();

export function useReflex(): ReflexState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}

export function useSession(): Session | null {
  return useSyncExternalStore(
    subscribe,
    () => session,
    () => null,
  );
}

/* ---------------- auth ---------------- */

export const DEMO_PASSWORD = "reflex123";

export const DEMO_ACCOUNTS: Array<Session & { password: string }> = [
  {
    role: "dispatcher",
    email: "dispatcher@reflex.demo",
    name: "Naomi Wairimu",
    password: DEMO_PASSWORD,
  },
  {
    role: "retailer",
    email: "retailer@reflex.demo",
    name: "TechZone Electronics",
    retailerId: "r1",
    password: DEMO_PASSWORD,
  },
  {
    role: "rider",
    email: "rider@reflex.demo",
    name: "Brian Otieno",
    riderId: "d1",
    password: DEMO_PASSWORD,
  },
];

export function signIn(email: string, password: string): Session | null {
  hydrate();
  const acct = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!acct || password !== DEMO_PASSWORD) return null;
  const { password: _pw, ...s } = acct;
  session = s;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  emit();
  return s;
}

export function signOut() {
  session = null;
  if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
  emit();
}

export function homeFor(role: Session["role"]) {
  return role === "retailer"
    ? "/retailer"
    : role === "dispatcher"
      ? "/dispatcher"
      : "/rider";
}

/* ---------------- lookups ---------------- */

export const retailers = RETAILERS;
export const retailerName = (id: string) => RETAILERS.find((r) => r.id === id)?.name ?? "Unknown";
export const riderById = (s: ReflexState, id: string | null) =>
  id ? (s.riders.find((r) => r.id === id) ?? null) : null;
export const findByOrderNo = (s: ReflexState, no: string) =>
  s.deliveries.find((d) => d.orderNo.toLowerCase() === no.trim().toLowerCase()) ?? null;

export function lookupOrder(no: string): Delivery | null {
  hydrate();
  return findByOrderNo(state, no);
}

/* ---------------- actions ---------------- */

export function createDelivery(input: {
  retailerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  item: string;
  notes?: string;
  priority: Priority;
}): Delivery {
  hydrate();
  const now = new Date().toISOString();
  const delivery: Delivery = {
    id: crypto.randomUUID(),
    orderNo: orderNo(state.seq),
    ...input,
    status: "Pending",
    riderId: null,
    pin: String(Math.floor(1000 + Math.random() * 9000)),
    createdAt: now,
    timeline: [{ status: "Pending", at: now, note: "Delivery request created" }],
  };
  commit({ ...state, seq: state.seq + 1, deliveries: [delivery, ...state.deliveries] });
  return delivery;
}

function update(id: string, fn: (d: Delivery) => Delivery) {
  hydrate();
  commit({
    ...state,
    deliveries: state.deliveries.map((d) => (d.id === id ? fn(d) : d)),
  });
}

export function assignRider(id: string, riderId: string, by = "Dispatcher") {
  const rider = state.riders.find((r) => r.id === riderId);
  update(id, (d) => ({
    ...d,
    riderId,
    status: d.status === "Pending" ? "Assigned" : d.status,
    timeline: [
      ...d.timeline,
      {
        status: d.status === "Pending" ? "Assigned" : d.status,
        at: new Date().toISOString(),
        note: `${d.riderId ? "Reassigned" : "Assigned"} to ${rider?.name ?? "rider"}`,
        by,
      },
    ],
  }));
}

export function setStatus(id: string, status: DeliveryStatus, note?: string, by?: string) {
  update(id, (d) => ({
    ...d,
    status,
    timeline: [...d.timeline, { status, at: new Date().toISOString(), note, by }],
  }));
}

export function confirmDelivery(
  id: string,
  input: { pin: string; recipientName: string; photo?: string },
): { ok: boolean; error?: string } {
  hydrate();
  const d = state.deliveries.find((x) => x.id === id);
  if (!d) return { ok: false, error: "Delivery not found" };
  if (input.pin.trim() !== d.pin) return { ok: false, error: "Incorrect customer PIN" };
  if (!input.recipientName.trim()) return { ok: false, error: "Recipient name is required" };
  const at = new Date().toISOString();
  update(id, (x) => ({
    ...x,
    status: "Delivered",
    pod: { recipientName: input.recipientName.trim(), photo: input.photo, at },
    timeline: [
      ...x.timeline,
      { status: "Delivered", at, note: `PIN verified • received by ${input.recipientName.trim()}` },
    ],
  }));
  return { ok: true };
}

export function toggleRiderAvailability(riderId: string) {
  hydrate();
  commit({
    ...state,
    riders: state.riders.map((r) => (r.id === riderId ? { ...r, available: !r.available } : r)),
  });
}

export function resetDemoData() {
  commit(initial());
}
