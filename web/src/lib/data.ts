import { createPublicClient } from "./supabase/public";
import type {
  Achievement,
  BlogPost,
  ClubEvent,
  CommitteeMember,
  Project,
  ProjectSection,
} from "./types";

/** True only when Supabase env vars are present. */
export function isConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Runs a Supabase query but never throws — if the backend isn't configured
 * yet or a query fails, callers get the provided fallback and the site still
 * renders. This keeps the public site resilient before/after DB setup.
 */
async function safe<T>(
  fn: (db: ReturnType<typeof createPublicClient>) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isConfigured()) return fallback;
  try {
    return await fn(createPublicClient());
  } catch (e) {
    console.error("[data] query failed:", e);
    return fallback;
  }
}

export function getCommittee() {
  return safe<CommitteeMember[]>(async (db) => {
    const { data } = await db
      .from("committee_members")
      .select("*")
      .order("sort_order");
    return data ?? [];
  }, []);
}

export function getProjects() {
  return safe<Project[]>(async (db) => {
    const { data } = await db
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return data ?? [];
  }, []);
}

export function getFeaturedProject() {
  return safe<Project | null>(async (db) => {
    const { data } = await db
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  }, null);
}

export function getProject(slug: string) {
  return safe<{ project: Project; sections: ProjectSection[] } | null>(
    async (db) => {
      const { data: project } = await db
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!project) return null;
      const { data: sections } = await db
        .from("project_sections")
        .select("*")
        .eq("project_id", project.id)
        .order("sort_order");
      return { project, sections: sections ?? [] };
    },
    null
  );
}

export function getPosts() {
  return safe<BlogPost[]>(async (db) => {
    const { data } = await db
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return data ?? [];
  }, []);
}

export function getPost(slug: string) {
  return safe<BlogPost | null>(async (db) => {
    const { data } = await db
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  }, null);
}

export function getAchievements() {
  return safe<Achievement[]>(async (db) => {
    const { data } = await db
      .from("achievements")
      .select("*")
      .order("happened_on", { ascending: true });
    return data ?? [];
  }, []);
}

export function getEvents() {
  return safe<ClubEvent[]>(async (db) => {
    const { data } = await db
      .from("events")
      .select("*")
      .eq("published", true)
      .order("starts_at", { ascending: true });
    return data ?? [];
  }, []);
}

export function getEvent(slug: string) {
  return safe<ClubEvent | null>(async (db) => {
    const { data } = await db
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data;
  }, null);
}
