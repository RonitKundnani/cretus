import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Github } from "@/components/icons/brand";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";

export function FeaturedProject({ project }: { project: Project }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <Reveal>
        <div className="grid items-center gap-10 rounded-3xl border border-border bg-surface/50 p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2">
            {project.cover_url ? (
              <Image
                src={project.cover_url}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="circuit-bg absolute inset-0 flex items-center justify-center opacity-70">
                <span className="animate-pulse-glow font-mono text-sm text-primary">
                  ● featured build
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Featured Project
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {project.title}
            </h2>
            {project.tagline && (
              <p className="mt-4 leading-relaxed text-muted">{project.tagline}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/projects/${project.slug}`}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-[#04180a]"
              >
                Read the build
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              {project.code_repo_url && (
                <a
                  href={project.code_repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Github size={16} /> Repo
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
