import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CommitteeGrid } from "@/components/committee-grid";
import { Timeline } from "@/components/timeline";
import { getCommittee, getAchievements } from "@/lib/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cretus is the Robotics & Automation Club of PDEU — learn who we are, our journey, and the committee behind the club.",
};

export default async function AboutPage() {
  const [committee, achievements] = await Promise.all([
    getCommittee(),
    getAchievements(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About Cretus"
        title="Nature-inspired. Circuit-driven."
        subtitle={SITE.mission}
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="card-glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold">Who we are</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Cretus is the student-run Robotics &amp; Automation Club of PDEU.
                Our logo says it all — three leaves, one of them a living circuit
                board. We believe technology grows best when it&apos;s hands-on,
                open, and shared.
              </p>
              <p className="mt-4 leading-relaxed text-muted">
                From soldering your first sensor to programming an autonomous
                robot, we give students a place to learn hardware, electronics,
                fabrication and code — and to build things that actually move.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold">Our mission</h2>
              <ul className="mt-4 space-y-4 text-muted">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Build real robotics projects and grow an open community around them.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Run workshops that turn curiosity into practical skill.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  Organize competitions that teach hardware, electronics and code under pressure.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {achievements.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-20">
          <SectionHeading center eyebrow="Our journey" title="Milestones" />
          <div className="mt-16">
            <Timeline items={achievements} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          center
          eyebrow="The team"
          title="Committee 2025–26"
          subtitle="The people keeping the soldering irons hot and the robots running."
        />
        <div className="mt-14">
          <CommitteeGrid members={committee} />
        </div>
      </section>
    </>
  );
}
