export type Role = "admin" | "committee";

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
};

export type Component = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  storage_location: string | null;
  created_at: string;
};

export type ComponentStock = {
  id: string;
  name: string;
  category: string | null;
  image_url: string | null;
  storage_location: string | null;
  total_acquired: number;
  total_issued: number;
  total_discarded: number;
  available: number;
};

export type Acquisition = {
  id: string;
  component_id: string;
  quantity: number;
  unit_cost: number | null;
  total_cost: number | null;
  vendor: string | null;
  bill_image_url: string | null;
  purchased_on: string | null;
  reason: string | null;
  event_id: string | null;
  added_by: string | null;
  created_at: string;
};

export type IssuanceStatus = "issued" | "returned" | "overdue";

export type Issuance = {
  id: string;
  component_id: string;
  quantity: number;
  issued_to_name: string;
  issued_to_contact: string | null;
  purpose: string | null;
  event_id: string | null;
  issued_by: string | null;
  issued_at: string;
  due_date: string | null;
  returned_at: string | null;
  status: IssuanceStatus;
};

export type DamageStatus = "reported" | "repaired" | "discarded";
export type DamageSeverity = "minor" | "major" | "total";

export type DamageReport = {
  id: string;
  component_id: string;
  quantity: number;
  severity: DamageSeverity;
  description: string | null;
  image_url: string | null;
  reported_by: string | null;
  reported_at: string;
  status: DamageStatus;
  resolution: string | null;
};

export type EventOption = {
  id: string;
  title: string;
  type: string;
};
