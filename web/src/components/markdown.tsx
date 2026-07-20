import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Themed markdown renderer used for blog posts, project sections, events. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h1 className="mt-8 mb-4 font-display text-3xl font-bold" {...p} />,
          h2: (p) => <h2 className="mt-8 mb-3 font-display text-2xl font-bold" {...p} />,
          h3: (p) => <h3 className="mt-6 mb-2 font-display text-xl font-semibold" {...p} />,
          p: (p) => <p className="mb-4 leading-relaxed text-foreground/90" {...p} />,
          a: (p) => (
            <a
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
              target="_blank"
              rel="noopener noreferrer"
              {...p}
            />
          ),
          ul: (p) => <ul className="mb-4 list-disc space-y-1.5 pl-5 text-foreground/90" {...p} />,
          ol: (p) => <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-foreground/90" {...p} />,
          li: (p) => <li className="leading-relaxed" {...p} />,
          blockquote: (p) => (
            <blockquote
              className="my-4 border-l-2 border-primary/50 bg-surface/50 py-1 pl-4 italic text-muted"
              {...p}
            />
          ),
          code: (p) => (
            <code
              className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-primary"
              {...p}
            />
          ),
          pre: (p) => (
            <pre
              className="mb-4 overflow-x-auto rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm"
              {...p}
            />
          ),
          table: (p) => (
            <div className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...p} />
            </div>
          ),
          th: (p) => (
            <th className="border border-border bg-surface px-3 py-2 text-left font-semibold" {...p} />
          ),
          td: (p) => <td className="border border-border px-3 py-2 text-foreground/90" {...p} />,
          hr: () => <hr className="my-8 border-border" />,
          img: (p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="my-4 rounded-xl border border-border" alt={p.alt ?? ""} {...p} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
