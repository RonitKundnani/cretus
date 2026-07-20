"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ArrowRightLeft,
  TriangleAlert,
  Receipt,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import type { Role } from "@/lib/types";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/components", label: "Components", icon: Boxes },
  { href: "/issuances", label: "Issue / Return", icon: ArrowRightLeft },
  { href: "/damage", label: "Damage log", icon: TriangleAlert },
  { href: "/acquisitions", label: "Purchases & Bills", icon: Receipt },
] as const;

export function Sidebar({
  fullName,
  role,
}: {
  fullName: string | null;
  role: Role;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    ...NAV,
    ...(role === "admin"
      ? [{ href: "/users", label: "Users", icon: Users } as const]
      : []),
  ];

  return (
    <>
      {/* mobile bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo/cretus-logo-transparent.png" alt="Cretus" width={32} height={24} className="h-7 w-auto" />
          <span className="font-display font-bold">Inventory</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="p-2">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-border lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col p-4 lg:w-64">
          <Link href="/" className="mb-8 hidden items-center gap-2.5 px-2 lg:flex">
            <Image src="/logo/cretus-logo-transparent.png" alt="Cretus" width={36} height={27} className="h-8 w-auto" />
            <div className="leading-tight">
              <p className="font-display text-sm font-bold">CRETUS</p>
              <p className="font-mono text-[10px] text-muted">inventory</p>
            </div>
          </Link>

          <nav className="flex flex-1 flex-col gap-1">
            {items.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/25"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-3 px-2">
              <p className="truncate text-sm font-medium">{fullName ?? "Member"}</p>
              <p className="font-mono text-[11px] uppercase tracking-wide text-primary">
                {role}
              </p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-danger"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
