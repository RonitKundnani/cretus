import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero/hero";
import { Pillars } from "@/components/home/pillars";
import { FeaturedProject } from "@/components/home/featured-project";
import { JoinCTA } from "@/components/home/join-cta";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { EventCard } from "@/components/cards/event-card";
import { PostCard } from "@/components/cards/post-card";
import { getFeaturedProject, getEvents, getPosts } from "@/lib/data";

export default async function HomePage() {
  const [featured, events, posts] = await Promise.all([
    getFeaturedProject(),
    getEvents(),
    getPosts(),
  ]);

  const upcoming = events
    .filter((e) => !e.starts_at || new Date(e.starts_at) >= new Date())
    .slice(0, 3);
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      <Hero />
      <Pillars />

      {featured && <FeaturedProject project={featured} />}

      {upcoming.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Come build"
              title="Upcoming events"
              subtitle="Workshops and competitions you can join."
            />
            <Link
              href="/events"
              className="hidden shrink-0 items-center gap-1 text-sm text-primary hover:underline sm:inline-flex"
            >
              All events <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {upcoming.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="From the club"
              title="Latest writing"
              subtitle="Notes, tutorials and deep-dives from our members."
            />
            <Link
              href="/blog"
              className="hidden shrink-0 items-center gap-1 text-sm text-primary hover:underline sm:inline-flex"
            >
              All posts <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {latestPosts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <JoinCTA />
    </>
  );
}
