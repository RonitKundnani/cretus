import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Clock, Users } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { RegistrationForm } from "@/components/registration-form";
import { getEvent } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event not found" };
  return { title: event.title, description: event.description_md.slice(0, 150) };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const upcoming = event.starts_at ? new Date(event.starts_at) >= new Date() : true;
  const canRegister = event.registration_open && upcoming;

  return (
    <article className="pb-10">
      <header className="relative overflow-hidden border-b border-border pb-14 pt-32">
        <div className="circuit-bg absolute inset-0 -z-10 opacity-50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_50%_-20%,rgba(57,230,58,0.12),transparent)]" />
        <div className="mx-auto max-w-5xl px-5">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
          >
            <ArrowLeft size={15} /> All events
          </Link>
          <span className="mt-6 inline-block rounded-full border border-primary/30 bg-background/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
            {event.type}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            {event.title}
          </h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 lg:grid-cols-[1fr_380px]">
        <div>
          {event.cover_url && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
              <Image
                src={event.cover_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 640px"
                priority
              />
            </div>
          )}
          <Markdown>{event.description_md}</Markdown>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card-glass space-y-4 rounded-2xl p-6 text-sm">
            {event.starts_at && (
              <p className="flex items-start gap-3">
                <CalendarDays size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted">Starts</span>
                  {formatDateTime(event.starts_at)}
                </span>
              </p>
            )}
            {event.ends_at && (
              <p className="flex items-start gap-3">
                <Clock size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted">Ends</span>
                  {formatDateTime(event.ends_at)}
                </span>
              </p>
            )}
            {event.location && (
              <p className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted">Where</span>
                  {event.location}
                </span>
              </p>
            )}
            {event.capacity != null && (
              <p className="flex items-start gap-3">
                <Users size={17} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs text-muted">Capacity</span>
                  {event.capacity} seats
                </span>
              </p>
            )}
          </div>

          {canRegister ? (
            <RegistrationForm eventId={event.id} />
          ) : (
            <div className="card-glass rounded-2xl p-6 text-center text-sm text-muted">
              {upcoming
                ? "Registration is closed for this event."
                : "This event has already taken place."}
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
