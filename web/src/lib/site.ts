export const SITE = {
  name: "Cretus",
  fullName: "Cretus — Robotics & Automation Club, PDEU",
  tagline: "Where nature meets technology.",
  mission:
    "A platform for learning hardware, electronics, fabrication and programming for robotics and its applications.",
  email: "cretus@pdpu.ac.in",
  location: "PDEU, Raisan Village, Gandhinagar, Gujarat, India — 382007",
  contacts: [
    { name: "Sarthak Mehta", phone: "+91 88490 63103" },
    { name: "Dhruv Ribbonwala", phone: "+91 88490 38236" },
  ],
  socials: {
    github: "https://github.com/Cretus-PDPU/",
    linkedin: "https://www.linkedin.com/company/cretus/about/",
    facebook: "https://www.facebook.com/cretus.pdpu",
    instagram: "https://www.instagram.com/cretus.pdpu/",
    discord: "https://discord.gg/8qHUPE5",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const PILLARS = [
  {
    title: "Projects",
    body: "We build real robots — from autonomous arms to sensor-driven machines — and grow an open community around them.",
    icon: "cpu",
  },
  {
    title: "Workshops",
    body: "Hands-on sessions on microcontrollers, sensors, actuators and code that turn curiosity into skill.",
    icon: "wrench",
  },
  {
    title: "Competitions",
    body: "We organize and compete — teaching hardware, electronics, programming and fabrication under pressure.",
    icon: "trophy",
  },
] as const;
