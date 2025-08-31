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
        BLUEPMS is a cutting-edge property and hotel management platform built
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
        A comprehensive suite covers Front Office, Point of Sale, Housekeeping,
        Accounts Receivables, F&amp;B Costing, and Purchase &amp; Inventory for
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
              {/* Icon */}
              <div
                className="
                  relative flex h-12 w-12 items-center justify-center
                  rounded-2xl bg-white/30 backdrop-blur-xl border border-white/60
                  shadow-[0_12px_30px_rgba(31,38,135,0.12)]
                  flex-shrink-0
                "
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent" />
                <Icon className="relative h-6 w-6 text-black" strokeWidth={2} />
              </div>

              {/* Copy (plain black, no bold) */}
              <div className="min-w-0 text-left">
                <h3 className="text-sm font-bold text-black mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[15px] md:text-base leading-relaxed text-black">
                  {item.render()}
                </p>
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/18 via-transparent to-transparent"
              />
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
