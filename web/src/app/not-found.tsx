import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] items-center justify-center overflow-hidden px-5 text-center">
      <div className="circuit-bg absolute inset-0 -z-10 opacity-50" />
      <div>
        <p className="font-mono text-sm text-primary">error 404</p>
        <h1 className="mt-3 font-display text-6xl font-bold text-glow">Lost signal.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          This circuit doesn&apos;t connect to anything. The page you&apos;re
          after may have moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04180a]"
        >
          <ArrowLeft size={16} /> Back home
        </Link>
      </div>
    </div>
  );
}
