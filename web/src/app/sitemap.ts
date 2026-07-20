import type { MetadataRoute } from "next";
import { getProjects, getPosts, getEvents } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cretus.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, events] = await Promise.all([
    getProjects(),
    getPosts(),
    getEvents(),
  ]);

  const staticRoutes = ["", "/about", "/projects", "/events", "/blog", "/contact"].map(
    (path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
    })
  );

  const dynamicRoutes = [
    ...projects.map((p) => ({ url: `${BASE}/projects/${p.slug}` })),
    ...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}` })),
    ...events.map((e) => ({ url: `${BASE}/events/${e.slug}` })),
  ].map((r) => ({ ...r, lastModified: new Date() }));

  return [...staticRoutes, ...dynamicRoutes];
}
