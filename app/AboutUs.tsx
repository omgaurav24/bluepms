/* app/AboutUs.tsx */
"use client";

import React, { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Cloud,
  Layers,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const container: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

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

type CardItem = {
  icon: LucideIcon;
  title: string;
  render: () => ReactNode;
};

const CARDS: CardItem[] = [
  {
    icon: Building2,
    title: "Modern PMS platform",
    render: () => (
      <>
        A cutting-edge property and hotel management platform built
        for modern operations with reliability, speed, and intuitive control.
      </>
    ),
  },
  {
    icon: Cloud,
    title: "Cloud + AI",
    render: () => (
      <>
        Built 100% cloud-based and AI-integrated, it delivers secure access,
        automatic updates, and smart automation that reduces manual work.
      </>
    ),
  },
  {
    icon: Layers,
    title: "Comprehensive suite",
    render: () => (
      <>
        Our suite covers Front Office, Point of Sale, Housekeeping,
        Accounts Receivables, F&amp;B, and Purchase &amp; Inventory for
        unified oversight.
      </>
    ),
  },
  {
    icon: Rocket,
    title: "Plug-and-play growth",
    render: () => (
      <>
        As a plug-and-play solution, BLUEPMS removes upfront costs, scales
        effortlessly, and elevates guest experience with enterprise-grade tools.
      </>
    ),
  },
];

export default function AboutUsBoxes({
  immediate = false,
}: {
  immediate?: boolean;
}) {
  const parentMotionProps = immediate
    ? ({ initial: "hidden", animate: "show" } as const)
    : ({
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount: 0.15 },
      } as const);

  return (
    <section
      aria-labelledby="about-title"
      className="relative w-full max-w-6xl mx-auto px-6"
    >
      <motion.div
        variants={container}
        {...parentMotionProps}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
      >
        {CARDS.map((item, i) => {
          const Icon = item.icon;
          const variants = i % 2 === 0 ? rowLeft : rowRight;
          return (
            <motion.article
              key={item.title}
              variants={variants}
              className="
                relative rounded-2xl p-5 sm:p-6
                border border-white/50 bg-white/15 backdrop-blur-2xl
                shadow-[0_10px_40px_rgba(31,38,135,0.14)]
                flex items-start gap-4 text-left
              "
            >
              {/* Liquid-glass icon (same shape, frosted + rim + gloss + subtle caustics) */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden flex-shrink-0">
                {/* body: untinted, just frost/saturate what's behind */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    background: "transparent",
                    backdropFilter: "blur(14px) saturate(170%)",
                    WebkitBackdropFilter: "blur(14px) saturate(170%)",
                  }}
                />
                {/* single rim (no seams) */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] pointer-events-none"
                  style={{
                    padding: 1,
                    background: "linear-gradient(#ffffffCC,#ffffffCC)",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    opacity: 0.85,
                  }}
                />
                {/* moving caustics (very subtle, same as modules tone) */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] pointer-events-none mix-blend-soft-light opacity-70 animate-[aurora_60s_linear_infinite]"
                  style={{
                    backgroundImage: [
                      "radial-gradient(55% 45% at 25% 25%, rgba(255,255,255,0.45), transparent 65%)",
                      "radial-gradient(45% 35% at 70% 70%, rgba(130,195,236,0.30), transparent 65%)",
                    ].join(","),
                    backgroundSize: "180% 180%, 200% 200%",
                    backgroundPosition: "0% 50%, 100% 50%",
                  }}
                />
                {/* top gloss */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0) 70%)",
                    maskImage:
                      "radial-gradient(160% 110% at 50% -20%, #000 30%, transparent 60%)",
                    WebkitMaskImage:
                      "radial-gradient(160% 110% at 50% -20%, #000 30%, transparent 60%)",
                    opacity: 0.95,
                  }}
                />
                {/* the icon glyph (kept neutral/dark for contrast) */}
                <Icon className="relative h-6 w-6 text-blue-700" strokeWidth={2} />
              </div>

              {/* Copy */}
              <div className="min-w-0 text-left">
                <h3 className="text-sm font-bold text-black mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[15px] md:text-base leading-relaxed text-black">
                  {item.render()}
                </p>
              </div>

              {/* card sheen */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/18 via-transparent to-transparent"
              />

              {/* local keyframes (safe if not already in globals) */}
              <style>{`
                @keyframes aurora_60s_linear_infinite {
                  0%   { background-position: 0% 50%, 100% 50%; }
                  50%  { background-position: 100% 50%, 0% 50%; }
                  100% { background-position: 0% 50%, 100% 50%; }
                }
              `}</style>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}