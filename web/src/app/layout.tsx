import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cretus — Robotics & Automation Club, PDEU",
    template: "%s · Cretus",
  },
  description:
    "Cretus is the Robotics & Automation Club of PDEU — a platform to learn hardware, electronics, fabrication and programming for robotics through projects, workshops and competitions.",
  keywords: [
    "Cretus",
    "PDEU",
    "robotics club",
    "automation",
    "Gandhinagar",
    "student club",
  ],
  metadataBase: new URL("https://cretus.vercel.app"),
  openGraph: {
    title: "Cretus — Robotics & Automation Club, PDEU",
    description:
      "Where nature meets technology. Projects, workshops and competitions in robotics & automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
      >
        <SmoothScroll>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
