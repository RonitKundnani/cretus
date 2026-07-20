import { createClient } from "./supabase/server";
import type {
  Acquisition,
  Component,
  ComponentStock,
  DamageReport,
  EventOption,
  Issuance,
  Profile,
} from "./types";

export async function getStock(): Promise<ComponentStock[]> {
  const db = await createClient();
  const { data } = await db
    .from("component_stock")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getComponents(): Promise<Component[]> {
  const db = await createClient();
  const { data } = await db.from("components").select("*").order("name");
  return data ?? [];
}

export async function getComponentOptions(): Promise<
  { id: string; name: string }[]
> {
  const db = await createClient();
  const { data } = await db
    .from("components")
    .select("id, name")
    .order("name");
  return data ?? [];
}

export async function getEventOptions(): Promise<EventOption[]> {
  const db = await createClient();
  const { data } = await db
    .from("events")
    .select("id, title, type")
    .order("starts_at", { ascending: false });
  return data ?? [];
}

/** Acquisitions joined with component name (and event title if linked). */
export async function getAcquisitions(): Promise<
  (Acquisition & { component: { name: string } | null; event: { title: string } | null })[]
> {
  const db = await createClient();
  const { data } = await db
    .from("acquisitions")
    .select("*, component:components(name), event:events(title)")
    .order("purchased_on", { ascending: false, nullsFirst: false });
  return data ?? [];
}

export async function getIssuances(): Promise<
  (Issuance & { component: { name: string } | null })[]
> {
  const db = await createClient();
  const { data } = await db
    .from("issuances")
    .select("*, component:components(name)")
    .order("issued_at", { ascending: false });
  return data ?? [];
}

export async function getDamageReports(): Promise<
  (DamageReport & { component: { name: string } | null })[]
> {
  const db = await createClient();
  const { data } = await db
    .from("damage_reports")
    .select("*, component:components(name)")
    .order("reported_at", { ascending: false });
  return data ?? [];
}

export async function getProfiles(): Promise<Profile[]> {
  const db = await createClient();
  const { data } = await db
    .from("profiles")
    .select("*")
    .order("created_at");
  return data ?? [];
}
