export type Role = "retailer" | "dispatcher" | "rider";

export type DeliveryStatus =
  | "Pending"
  | "Assigned"
  | "Picked Up"
  | "In Transit"
  | "Delivered"
  | "Failed"
  | "Cancelled";

export const STATUSES: DeliveryStatus[] = [
  "Pending",
  "Assigned",
  "Picked Up",
  "In Transit",
  "Delivered",
  "Failed",
  "Cancelled",
];

export type Priority = "Normal" | "Urgent" | "Express";

export type Retailer = {
  id: string;
  name: string;
  area: string;
};

export type Rider = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  available: boolean;
};

export type TimelineEntry = {
  status: DeliveryStatus;
  at: string;
  note?: string;
  by?: string;
};

export type ProofOfDelivery = {
  recipientName: string;
  photo?: string;
  at: string;
};

export type Delivery = {
  id: string;
  orderNo: string;
  retailerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  item: string;
  notes?: string;
  priority: Priority;
  status: DeliveryStatus;
  riderId: string | null;
  pin: string;
  createdAt: string;
  timeline: TimelineEntry[];
  pod?: ProofOfDelivery;
};

export type Session = {
  role: Role;
  name: string;
  email: string;
  retailerId?: string;
  riderId?: string;
};
