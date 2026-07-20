import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/types";
import { formatDate } from "@/lib/format";

const typeStyles: Record<string, string> = {
  workshop: "border-primary/30 text-primary",
  competition: "border-yellow-400/30 text-yellow-300",
  event: "border-forest/40 text-forest",
};

export function EventCard({ event }: { event: ClubEvent }) {
  const upcoming = event.starts_at ? new Date(event.starts_at) > new Date() : false;
  return (
    <Link
      href={`/events/${event.slug}`}
      className="card-glass group flex h-full flex-col rounded-2xl p-6 hover:-translate-y-1"
    >
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${
            typeStyles[event.type] ?? typeStyles.event
          }`}
        >
          {event.type}
        </span>
        {upcoming && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            Upcoming
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-primary">
        {event.title}
      </h3>
      <div className="mt-4 space-y-2 text-sm text-muted">
        {event.starts_at && (
          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="text-primary" />
            {formatDate(event.starts_at)}
          </p>
        )}
        {event.location && (
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-primary" />
            {event.location}
          </p>
        )}
      </div>
    </Link>
  );
}
