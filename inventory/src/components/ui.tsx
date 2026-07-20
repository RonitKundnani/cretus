import Link from "next/link";
import type { ComponentType } from "react";

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "default",
  href,
}: {
  label: string;
  value: number | string;
  icon: ComponentType<{ size?: number; className?: string }>;
  tone?: "default" | "primary" | "warn" | "danger";
  href?: string;
}) {
  const toneClass = {
    default: "text-foreground",
    primary: "text-primary",
    warn: "text-warn",
    danger: "text-danger",
  }[tone];

  const inner = (
    <div className="card flex items-center gap-4 p-5 transition-colors hover:border-[var(--border-strong)]">
      <div className={`rounded-xl border border-border bg-surface-2 p-3 ${toneClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`font-display text-2xl font-bold ${toneClass}`}>{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

const badgeTones: Record<string, string> = {
  issued: "border-primary/30 text-primary",
  returned: "border-border text-muted",
  overdue: "border-danger/40 text-danger",
  reported: "border-warn/40 text-warn",
  repaired: "border-primary/30 text-primary",
  discarded: "border-danger/40 text-danger",
  minor: "border-border text-muted",
  major: "border-warn/40 text-warn",
  total: "border-danger/40 text-danger",
  admin: "border-primary/30 text-primary",
  committee: "border-border text-muted",
};

export function Badge({ value }: { value: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${
        badgeTones[value] ?? "border-border text-muted"
      }`}
    >
      {value}
    </span>
  );
}

export function TableEmpty({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-muted">
        {text}
      </td>
    </tr>
  );
}
