import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EventCard } from "@/components/cards/event-card";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Workshops and competitions hosted by Cretus. Register to join the next one.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const upcoming = events.filter(
    (e) => !e.starts_at || new Date(e.starts_at) >= now
  );
  const past = events
    .filter((e) => e.starts_at && new Date(e.starts_at) < now)
    .reverse();

  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Workshops & competitions."
        subtitle="Hands-on sessions and high-stakes builds. Come learn, come compete."
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        {events.length === 0 ? (
          <EmptyState
            title="No events scheduled yet."
            hint="Publish an event from the club admin, or run the seed data."
          />
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Nothing on the calendar right now — check back soon.
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((e, i) => (
                  <Reveal key={e.id} delay={(i % 3) * 0.08}>
                    <EventCard event={e} />
                  </Reveal>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <>
                <h2 className="mt-20 font-display text-2xl font-bold">Past events</h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {past.map((e, i) => (
                    <Reveal key={e.id} delay={(i % 3) * 0.08}>
                      <div className="opacity-70">
                        <EventCard event={e} />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
