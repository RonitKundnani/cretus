import { SITE } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Github } from "@/components/icons/brand";

export function JoinCTA() {
  return (
    <section id="join" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 md:p-16">
          <div className="circuit-bg absolute inset-0 opacity-50" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Join Cretus
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Build the machines of tomorrow with us.
            </h2>
            <p className="mt-5 text-muted">
              Whether you solder, code, design, or just love robots — there&apos;s a
              place for you. Come to a workshop, join a project, or hop into our
              community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={SITE.socials.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04180a] transition-shadow hover:shadow-[0_0_30px_var(--glow)]"
              >
                <MessageCircle size={16} />
                Join our Discord
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href={SITE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Github size={16} />
                See our code
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
