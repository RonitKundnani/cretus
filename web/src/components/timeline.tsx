import type { Achievement } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export function Timeline({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* vertical trace */}
      <div className="absolute left-3 top-2 h-full w-px bg-gradient-to-b from-primary/50 via-border to-transparent md:left-1/2" />
      <ul className="space-y-10">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={0.05}>
            <li
              className={`relative flex flex-col gap-1 pl-10 md:w-1/2 md:pl-0 ${
                i % 2 === 0
                  ? "md:ml-0 md:pr-10 md:text-right"
                  : "md:ml-auto md:pl-10"
              }`}
            >
              <span
                className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_var(--glow)] md:left-auto ${
                  i % 2 === 0 ? "md:-right-1.5" : "md:-left-1.5"
                }`}
              />
              {item.happened_on && (
                <p className="font-mono text-xs text-primary">
                  {formatDate(item.happened_on)}
                </p>
              )}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              )}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
