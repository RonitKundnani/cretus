import Image from "next/image";
import { User } from "lucide-react";
import { Github, Linkedin } from "@/components/icons/brand";
import type { CommitteeMember } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";

export function CommitteeGrid({ members }: { members: CommitteeMember[] }) {
  if (members.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Committee line-up coming soon.
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m, i) => (
        <Reveal key={m.id} delay={(i % 3) * 0.06}>
          <div className="card-glass group h-full rounded-2xl p-6 text-center hover:-translate-y-1">
            <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-border bg-surface-2">
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted">
                  <User size={32} />
                </div>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{m.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-primary">
              {m.role}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on LinkedIn`}
                  className="rounded-lg border border-border p-2 text-muted hover:border-primary/40 hover:text-primary"
                >
                  <Linkedin size={15} />
                </a>
              )}
              {m.github && (
                <a
                  href={m.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on GitHub`}
                  className="rounded-lg border border-border p-2 text-muted hover:border-primary/40 hover:text-primary"
                >
                  <Github size={15} />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
