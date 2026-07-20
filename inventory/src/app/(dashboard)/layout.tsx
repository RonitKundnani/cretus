import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { getProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="lg:grid lg:grid-cols-[auto_1fr]">
      <Sidebar fullName={profile.full_name} role={profile.role} />
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl px-5 py-8">{children}</div>
      </div>
    </div>
  );
}
