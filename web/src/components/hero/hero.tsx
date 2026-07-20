"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroScene = dynamic(() => import("./scene"), { ssr: false });

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* backdrop */}
      <div className="circuit-bg absolute inset-0 -z-20 opacity-60" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(57,230,58,0.12),transparent)]" />

      {/* 3D layer (or static fallback) — explicit h/w so R3F measures correctly */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        {reduce ? (
          <div className="flex h-full items-center justify-center">
            <Image
              src="/logo/cretus-logo-transparent.png"
              alt="Cretus logo"
              width={320}
              height={240}
              className="w-64 opacity-90 md:w-80"
              priority
            />
          </div>
        ) : (
          <HeroScene />
        )}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 font-mono text-xs text-primary backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
            Robotics & Automation Club · PDEU
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-display text-5xl font-bold leading-[1.02] sm:text-6xl md:text-7xl"
          >
            Where <span className="text-gradient">nature</span> meets{" "}
            <span className="text-glow">technology</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            Cretus is a student-run robotics club building real machines — through
            hands-on projects, workshops, and competitions in hardware, electronics
            and code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-[#04180a] transition-shadow hover:shadow-[0_0_30px_var(--glow)]"
            >
              Explore Projects
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/#join"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              Join the Club
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted">
        <ChevronDown size={22} className="animate-float" />
      </div>
    </section>
  );
}
