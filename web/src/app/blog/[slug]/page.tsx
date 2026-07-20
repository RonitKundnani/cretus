import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { getPost } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="pb-10">
      <header className="relative overflow-hidden border-b border-border pb-14 pt-32">
        <div className="circuit-bg absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-3xl px-5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary"
          >
            <ArrowLeft size={15} /> All posts
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted"
              >
                #{t}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 font-mono text-sm text-muted">
            {formatDate(post.published_at ?? post.created_at)}
            {post.author ? ` · ${post.author}` : ""}
          </p>
        </div>
      </header>

      {post.cover_url && (
        <div className="mx-auto mt-10 max-w-4xl px-5">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl px-5">
        <Markdown>{post.content_md}</Markdown>
      </div>
    </article>
  );
}
