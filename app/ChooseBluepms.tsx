/* app/ChooseBluepms.tsx */
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Brain, Cloud, Layers, SmilePlus, type LucideIcon } from "lucide-react";

// headline animation
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
const word: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// alternating row entrances
const rowLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};
const rowRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

type Row = { icon: LucideIcon; title: string; tagline: string };

const rows: Row[] = [
  {
    icon: Brain,
    title: "AI-powered, ready from day one",
    tagline:
      "Deploy instantly with automation across reservations, ops, and insights.",
  },
  {
    icon: Cloud,
    title: "Zero hardware, zero maintenance",
    tagline: "Cloud-native—no servers to buy, patch, or babysit. Ever.",
  },
  {
    icon: Layers,
    title: "Flexible & scalable",
    tagline: "From boutique to multi-property chains with unified control.",
  },
  {
    icon: SmilePlus,
    title: "Better guest experience",
    tagline:
      "Faster responses, personalization, higher satisfaction and loyalty.",
  },
];

const headline = "Why Choose BLUEPMS?";

export default function ChooseBluepms() {
  return (
    <section
      id="choose-bluepms"
      className="relative w-full max-w-6xl mx-auto px-6 pt-20 pb-10 min-h-screen flex flex-col"
      aria-labelledby="choose-bluepms-title"
    >
      {/* Split headline */}
      <motion.h2
        id="choose-bluepms-title"
        className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 text-left md:text-center"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        {headline.split(" ").map((w, i) => (
          <motion.span key={w + i} variants={word} className="inline-block mr-2">
            {w}
          </motion.span>
        ))}
      </motion.h2>

      {/* Row list */}
      <div
        className="
          relative mt-10 rounded-3xl overflow-hidden
          border border-white/40 bg-white/10 backdrop-blur-2xl
          shadow-[0_10px_40px_rgba(31,38,135,0.10)]
          divide-y divide-white/20
        "
      >
        {/* animated 'caustics' overlay */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light
            animate-[aurora_60s_linear_infinite]
            [background-image:radial-gradient(40%_30%_at_20%_20%,rgba(255,255,255,0.45),transparent_60%),radial-gradient(35%_25%_at_80%_60%,rgba(96,165,250,0.35),transparent_60%)]
            [background-size:160%_160%,180%_180%]
            [background-position:0%_50%,100%_50%] 
          "
        />
        {/* rows */}
        {rows.map((r, i) => {
          const Icon = r.icon;
          const variants = i % 2 === 0 ? rowLeft : rowRight;
          return (
            <motion.div
              key={r.title}
              variants={variants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-5 md:px-7 py-6 bg-white/5"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* icon capsule */}
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-2xl
                             bg-white/30 backdrop-blur-xl border border-white/60
                             shadow-[0_12px_30px_rgba(31,38,135,0.12)]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent" />
                  <Icon className="relative h-6 w-6 text-blue-600" strokeWidth={2} />
                </div>
                <div className="text-xl font-semibold text-gray-900 truncate">
                  {r.title}
                </div>
              </div>

              <div className="text-gray-700 text-base md:text-lg leading-relaxed md:max-w-3xl">
                {r.tagline}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer pill */}
      <footer className="mt-auto pt-10 flex justify-center">
        {/* Seamless, untinted liquid-glass pill (no frost) */}
        <nav
          aria-label="Footer"
          className="relative inline-flex items-center px-2 py-1 rounded-full text-sm text-gray-900"
        >
          {/* 1) Transparent glass body */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
            }}
          />
          {/* 2) Single continuous rim */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              padding: 1,
              background: "linear-gradient(#ffffffAA,#ffffffAA)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              boxShadow:
                "inset 0 1px 2px rgba(255,255,255,0.45), 0 8px 24px rgba(12,18,28,0.20)",
            }}
          />
          {/* 3) Gloss layer */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0) 70%)",
              maskImage:
                "radial-gradient(140% 90% at 50% -10%, #000 20%, transparent 60%)",
              WebkitMaskImage:
                "radial-gradient(140% 90% at 50% -10%, #000 20%, transparent 60%)",
              opacity: 0.3,
            }}
          />

          {/* 4) Content */}
          <div className="relative z-10 flex items-center gap-0 select-none">
            <span className="px-4 py-2">
              © 2025 <span className="font-semibold">BLUEPMS</span>
            </span>

            <a
              href="#rights"
              className="px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-colors hover:text-gray-950"
            >
              All rights reserved
            </a>

            {/* CHANGED: route to /contact */}
            <Link
              href="/contact"
              className="px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-colors hover:text-gray-950"
            >
              Contact Us
            </Link>

            <a
              href="#privacy"
              className="px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 transition-colors hover:text-gray-950"
            >
              Privacy Policy
            </a>
          </div>
        </nav>
      </footer>
    </section>
  );
}