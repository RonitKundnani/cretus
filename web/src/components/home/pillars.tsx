import { Cpu, Wrench, Trophy } from "lucide-react";
import { PILLARS } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const icons = { cpu: Cpu, wrench: Wrench, trophy: Trophy } as const;

export function Pillars() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading
        center
        eyebrow="What we do"
        title="Three ways we build"
        subtitle="Cretus turns curiosity about machines into real, working robotics."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {PILLARS.map((p, i) => {
          const Icon = icons[p.icon as keyof typeof icons];
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="card-glass group h-full rounded-2xl p-7 hover:-translate-y-1">
                <div className="mb-5 inline-flex rounded-xl border border-border bg-forest-deep/40 p-3 text-primary transition-colors group-hover:border-primary/40">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
