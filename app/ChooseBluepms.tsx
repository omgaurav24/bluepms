"use client";

import { motion, type Variants } from "framer-motion";
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
      // flex column + min-h-screen pushes footer to true bottom via mt-auto
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
          <motion.span
            key={w + i}
            variants={word}
            className="inline-block mr-2"
          >
            {w}
          </motion.span>
        ))}
      </motion.h2>

      {/* Row list */}
      <div className="mt-10 divide-y divide-neutral-200 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_10px_40px_rgba(31,38,135,0.10)]">
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
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-5 md:px-7 py-6"
            >
              {/* left: glass icon + title */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_30px_rgba(31,38,135,0.12)]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent" />
                  <Icon
                    className="relative h-6 w-6 text-blue-600"
                    strokeWidth={2}
                  />
                </div>
                <div className="text-xl font-semibold text-gray-900 truncate">
                  {r.title}
                </div>
              </div>

              {/* right: tagline */}
              <div className="text-gray-600 text-base md:text-lg leading-relaxed md:max-w-3xl">
                {r.tagline}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer at the true bottom via mt-auto */}
      <footer className="mt-auto pt-10 flex justify-center">
        {/* Connected liquid-glass pills (segmented chip) */}
        <nav
          aria-label="Footer"
          className="
            inline-flex overflow-hidden rounded-full
            bg-white/30 backdrop-blur-2xl border border-white/40
            shadow-[0_8px_28px_rgba(31,38,135,0.15)]
            text-sm text-gray-700
          "
        >
          {/* Segment 1: copyright */}
          <span className="px-4 py-2 bg-white/40">
            © 2025 <span className="font-semibold">BLUEPMS</span>
          </span>

          {/* Segment divider (hairline) */}

          <span className="w-px bg-white/50" aria-hidden />

          {/* Segment 2: contact */}
          <a
            href="#contact"
            className="px-4 py-2 hover:bg-white/45 transition-colors"
          >
            All rights reserved
          </a>
          {/* Segment divider (hairline) */}
          <span className="w-px bg-white/50" aria-hidden />

          {/* Segment 2: contact */}
          <a
            href="https://wa.me/14258940847?text=Hi!%20I'm%20interested%20in%20BLUEPMS."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 hover:bg-white/45 transition-colors"
          >
            Contact Us
          </a>

          <span className="w-px bg-white/50" aria-hidden />

          {/* Segment 3: privacy */}
          <a
            href="#privacy"
            className="px-4 py-2 hover:bg-white/45 transition-colors"
          >
            Privacy Policy
          </a>
        </nav>
      </footer>
    </section>
  );
}
