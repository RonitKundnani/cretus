import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="card-glass mx-auto max-w-md rounded-2xl p-12 text-center">
      <div className="mx-auto mb-4 inline-flex rounded-xl border border-border bg-surface-2 p-3 text-primary">
        <Inbox size={22} />
      </div>
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </div>
  );
}
