import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { Github, Linkedin, Facebook, Instagram } from "@/components/icons/brand";
import { SITE, NAV_LINKS } from "@/lib/site";

const socialIcons = [
  { href: SITE.socials.github, label: "GitHub", Icon: Github },
  { href: SITE.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: SITE.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: SITE.socials.facebook, label: "Facebook", Icon: Facebook },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="circuit-bg absolute inset-0 -z-10 opacity-40" />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo/cretus-logo-transparent.png"
              alt="Cretus"
              width={44}
              height={33}
              className="h-9 w-auto"
            />
            <span className="font-display text-xl font-bold">CRETUS</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {SITE.mission}
          </p>
          <div className="mt-5 flex gap-3">
            {socialIcons.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-lg border border-border p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              {SITE.location}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-primary" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Cretus · Robotics & Automation Club, PDEU.</p>
          <p className="font-mono">Where nature meets technology.</p>
        </div>
      </div>
    </footer>
  );
}
