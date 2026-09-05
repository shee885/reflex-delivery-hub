import type { Delivery, DeliveryStatus, Priority, Retailer, Rider } from "./types";

export const RETAILERS: Retailer[] = [
  { id: "r1", name: "TechZone Electronics", area: "Moi Avenue, Nairobi" },
  { id: "r2", name: "Afya Pharmacy", area: "Kilimani, Nairobi" },
  { id: "r3", name: "BuildRight Hardware", area: "Industrial Area, Nairobi" },
];

export const SEED_RIDERS: Rider[] = [
  { id: "d1", name: "Brian Otieno", phone: "+254712445901", vehicle: "Boda • KMEA 812J", available: true },
  { id: "d2", name: "Kevin Mwangi", phone: "+254733208114", vehicle: "Boda • KMFQ 447L", available: true },
  { id: "d3", name: "Daniel Kamau", phone: "+254720889302", vehicle: "Pickup • KCX 119D", available: false },
  { id: "d4", name: "John Kiptoo", phone: "+254798115427", vehicle: "Boda • KMGA 703R", available: true },
];

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

type SeedRow = {
  n: number;
  retailerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  item: string;
  notes?: string;
  priority: Priority;
  status: DeliveryStatus;
  riderId: string | null;
  age: number;
};

const ROWS: SeedRow[] = [
  { n: 118, retailerId: "r1", customerName: "Mercy Wanjiru", customerPhone: "+254711234567", address: "Westlands, Sarit Centre, Nairobi", item: "Samsung A15 phone + case", priority: "Normal", status: "Delivered", riderId: "d1", age: 52 },
  { n: 119, retailerId: "r2", customerName: "Peter Njoroge", customerPhone: "+254722345678", address: "Kileleshwa, Othaya Road, Nairobi", item: "Prescription refill (2 items)", notes: "Call before arriving", priority: "Urgent", status: "Delivered", riderId: "d2", age: 47 },
  { n: 120, retailerId: "r3", customerName: "Grace Achieng", customerPhone: "+254733456789", address: "Embakasi, Pipeline Estate, Nairobi", item: "20kg cement x4", priority: "Normal", status: "Failed", riderId: "d3", age: 40 },
  { n: 121, retailerId: "r1", customerName: "Ali Hassan", customerPhone: "+254744567890", address: "South B, Mariakani Estate, Nairobi", item: "HP laptop charger", priority: "Express", status: "In Transit", riderId: "d1", age: 6 },
  { n: 122, retailerId: "r2", customerName: "Faith Chebet", customerPhone: "+254755678901", address: "Lavington, James Gichuru Road, Nairobi", item: "Blood pressure monitor", notes: "Leave at gate house", priority: "Urgent", status: "In Transit", riderId: "d2", age: 4 },
  { n: 123, retailerId: "r3", customerName: "Samuel Mutiso", customerPhone: "+254766789012", address: "Ruaka, Gacharage Road, Kiambu", item: "Plumbing fittings set", priority: "Normal", status: "Picked Up", riderId: "d4", age: 3 },
  { n: 124, retailerId: "r1", customerName: "Lilian Auma", customerPhone: "+254777890123", address: "Kasarani, Sunton Estate, Nairobi", item: "JBL bluetooth speaker", priority: "Normal", status: "Assigned", riderId: "d1", age: 2 },
  { n: 125, retailerId: "r2", customerName: "Dennis Kariuki", customerPhone: "+254788901234", address: "Karen, Bogani East Road, Nairobi", item: "Baby formula + vitamins", notes: "Gate code 4412", priority: "Express", status: "Assigned", riderId: "d4", age: 2 },
  { n: 126, retailerId: "r3", customerName: "Janet Nyambura", customerPhone: "+254799012345", address: "Thika Road, Roysambu, Nairobi", item: "Cordless drill + bits", priority: "Normal", status: "Pending", riderId: null, age: 1 },
  { n: 127, retailerId: "r1", customerName: "Victor Omondi", customerPhone: "+254700123456", address: "Ngong Road, Adams Arcade, Nairobi", item: "Smart TV wall mount", priority: "Urgent", status: "Pending", riderId: null, age: 1 },
  { n: 128, retailerId: "r2", customerName: "Rose Mueni", customerPhone: "+254701234567", address: "Donholm, Phase 5, Nairobi", item: "First aid kit", priority: "Normal", status: "Pending", riderId: null, age: 0.5 },
  { n: 129, retailerId: "r3", customerName: "Michael Barasa", customerPhone: "+254702345678", address: "Kitengela, Milimani, Kajiado", item: "Steel door hinges x12", priority: "Normal", status: "Cancelled", riderId: null, age: 20 },
];

const FLOW: DeliveryStatus[] = ["Pending", "Assigned", "Picked Up", "In Transit", "Delivered"];

export const orderNo = (n: number) => `RFX-${String(n).padStart(5, "0")}`;

export function buildSeedDeliveries(): Delivery[] {
  return ROWS.map((row) => {
    const created = hoursAgo(row.age);
    const timeline = [{ status: "Pending" as DeliveryStatus, at: created, note: "Delivery request created" }];
    const idx = FLOW.indexOf(row.status);
    if (idx > 0) {
      for (let i = 1; i <= idx; i++) {
        timeline.push({ status: FLOW[i]!, at: hoursAgo(Math.max(0.1, row.age - i * 0.4)) });
      }
    } else if (row.status === "Failed") {
      timeline.push({ status: "Assigned", at: hoursAgo(row.age - 0.4) });
      timeline.push({ status: "Picked Up", at: hoursAgo(row.age - 0.8) });
      timeline.push({ status: "In Transit", at: hoursAgo(row.age - 1.2) });
      timeline.push({ status: "Failed", at: hoursAgo(row.age - 2), note: "Customer unreachable at address" });
    } else if (row.status === "Cancelled") {
      timeline.push({ status: "Cancelled", at: hoursAgo(row.age - 1), note: "Cancelled by retailer" });
    }

    const delivered = row.status === "Delivered";
    return {
      id: `seed-${row.n}`,
      orderNo: orderNo(row.n),
      retailerId: row.retailerId,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      address: row.address,
      item: row.item,
      notes: row.notes,
      priority: row.priority,
      status: row.status,
      riderId: row.riderId,
      pin: String(1000 + ((row.n * 37) % 9000)),
      createdAt: created,
      timeline,
      pod: delivered
        ? { recipientName: row.customerName, at: timeline[timeline.length - 1]!.at }
        : undefined,
    } satisfies Delivery;
  });
}

export const NEXT_SEQ = 130;
