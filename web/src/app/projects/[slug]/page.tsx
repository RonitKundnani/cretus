import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Github } from "@/components/icons/brand";
import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/ui/reveal";
import { getProject } from "@/lib/data";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) return { title: "Project not found" };
  return {
    title: data.project.title,
    description: data.project.tagline ?? undefined,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) notFound();
  const { project, sections } = data;

  return (
    <article className="pb-10">
      <header className="relative overflow-hidden border-b border-border pb-14 pt-32">
        <div className="circuit-bg absolute inset-0 -z-10 opacity-50" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_50%_-20%,rgba(57,230,58,0.12),transparent)]" />
        <div className="mx-auto max-w-3xl px-5">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
          >
            <ArrowLeft size={15} /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-primary/30 bg-background/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-primary">
              {project.status}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {project.tagline}
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {project.code_repo_url && (
              <a
                href={project.code_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Github size={15} /> Code repository
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                <ExternalLink size={15} /> Live demo
              </a>
            )}
          </div>
        </div>
      </header>

      {project.cover_url && (
        <div className="mx-auto mt-10 max-w-4xl px-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={project.cover_url}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-14 max-w-3xl px-5">
        {sections.length === 0 ? (
          <p className="text-muted">Full write-up coming soon.</p>
        ) : (
          <div className="space-y-14">
            {sections.map((s) => (
              <Reveal key={s.id}>
                <section id={s.heading.toLowerCase().replace(/\s+/g, "-")}>
                  <h2 className="mb-5 flex items-center gap-3 font-display text-2xl font-bold">
                    <span className="h-5 w-1 rounded-full bg-primary" />
                    {s.heading}
                  </h2>
                  <Markdown>{s.body_md}</Markdown>
                </section>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
