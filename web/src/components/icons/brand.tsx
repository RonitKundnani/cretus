/**
 * Brand/social icons as inline SVGs.
 * lucide-react removed brand glyphs, so we ship our own with the same
 * `size` API used elsewhere.
 */
type IconProps = { size?: number; className?: string };

function base(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className,
    "aria-hidden": true,
  } as const;
}

export function Github({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.28 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function Linkedin({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function Instagram({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size, className)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Facebook({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function Discord({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M20.32 4.37A19.8 19.8 0 0 0 15.45 3a13.6 13.6 0 0 0-.62 1.28 18.3 18.3 0 0 0-5.66 0A13 13 0 0 0 8.55 3a19.7 19.7 0 0 0-4.88 1.37C.58 8.98-.26 13.46.16 17.88a19.9 19.9 0 0 0 6 3.03c.48-.66.91-1.36 1.28-2.1-.7-.26-1.37-.58-2.01-.96.17-.12.33-.25.49-.38a14.2 14.2 0 0 0 12.16 0c.16.14.32.26.49.38-.64.38-1.32.7-2.02.96.37.74.8 1.44 1.28 2.1a19.8 19.8 0 0 0 6.01-3.03c.5-5.12-.84-9.56-3.52-13.51ZM8.02 15.16c-1.17 0-2.13-1.08-2.13-2.4 0-1.32.94-2.4 2.13-2.4s2.15 1.09 2.13 2.4c0 1.32-.95 2.4-2.13 2.4Zm7.96 0c-1.17 0-2.13-1.08-2.13-2.4 0-1.32.94-2.4 2.13-2.4s2.15 1.09 2.13 2.4c0 1.32-.94 2.4-2.13 2.4Z" />
    </svg>
  );
}
