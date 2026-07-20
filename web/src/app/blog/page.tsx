import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { PostCard } from "@/components/cards/post-card";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { getPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tutorials, deep-dives and notes from the Cretus robotics community.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the workbench."
        subtitle="Tutorials, build logs and deep-dives from our members."
      />
      <section className="mx-auto max-w-7xl px-5 py-20">
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet."
            hint="Publish your first post from the club admin."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
