"use client";

import { ReactLenis } from "lenis/react";

/** Global smooth-scroll wrapper. Lenis honors prefers-reduced-motion by default. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
