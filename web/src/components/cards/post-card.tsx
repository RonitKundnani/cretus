import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card-glass group flex h-full flex-col overflow-hidden rounded-2xl hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
        {post.cover_url ? (
          <Image
            src={post.cover_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="circuit-bg absolute inset-0 opacity-60" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted"
            >
              #{t}
            </span>
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {post.excerpt}
          </p>
        )}
        <p className="mt-4 font-mono text-xs text-muted">
          {formatDate(post.published_at ?? post.created_at)}
          {post.author ? ` · ${post.author}` : ""}
        </p>
      </div>
    </Link>
  );
}
