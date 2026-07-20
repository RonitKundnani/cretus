import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-glass group flex h-full flex-col overflow-hidden rounded-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="circuit-bg absolute inset-0 flex items-center justify-center opacity-70">
            <span className="font-mono text-xs text-primary">// {project.status}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-primary backdrop-blur">
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">{project.title}</h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-muted transition-colors group-hover:text-primary"
          />
        </div>
        {project.tagline && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {project.tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
