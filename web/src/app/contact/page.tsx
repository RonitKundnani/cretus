import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Github, Linkedin, Instagram } from "@/components/icons/brand";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Cretus — the Robotics & Automation Club of PDEU.",
};

const socialLinks = [
  { href: SITE.socials.github, label: "GitHub", Icon: Github },
  { href: SITE.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: SITE.socials.discord, label: "Discord", Icon: MessageCircle },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk robots."
        subtitle="Questions, collaborations, sponsorships or just want to join — reach out."
      />

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2">
        <Reveal>
          <div className="space-y-6">
            <div className="card-glass flex items-start gap-4 rounded-2xl p-6">
              <MapPin className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <h3 className="font-semibold">Find us</h3>
                <p className="mt-1 text-sm text-muted">{SITE.location}</p>
              </div>
            </div>
            <div className="card-glass flex items-start gap-4 rounded-2xl p-6">
              <Mail className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-1 block text-sm text-muted hover:text-primary"
                >
                  {SITE.email}
                </a>
              </div>
            </div>
            <div className="card-glass flex items-start gap-4 rounded-2xl p-6">
              <Phone className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <h3 className="font-semibold">Call</h3>
                <ul className="mt-1 space-y-1 text-sm text-muted">
                  {SITE.contacts.map((c) => (
                    <li key={c.phone}>
                      {c.name} —{" "}
                      <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                        {c.phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-xl border border-border p-3 text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
