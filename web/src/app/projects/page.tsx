import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectCard } from "@/components/cards/project-card";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Robotics builds by Cretus — from an autonomous chess-playing robot to sensor-driven machines. Full write-ups with components, code and lessons learned.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things we've built."
        subtitle="Not just a showcase — each project is a full build log with the components, the code, and the problems we hit along the way."
      />
      <section className="mx-auto max-w-7xl px-5 py-20">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects published yet."
            hint="Add one from the club admin, or run the seed data to see the chess-playing robot."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
