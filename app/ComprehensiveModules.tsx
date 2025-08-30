"use client";

import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Users,
  CreditCard,
  UtensilsCrossed,
  ShoppingCart,
  Boxes,
  type LucideIcon,
} from "lucide-react";

type ModuleCard = {
  icon: LucideIcon;
  title: string;
  points: string[];
};

const firstRow: ModuleCard[] = [
  {
    icon: Calendar,
    title: "Front Office",
    points: [
      "Real-time availability & automated guest comms",
      "Custom tariffs/plans per day of stay",
      "Auto room assignment to maximize occupancy",
      "Powerful analytics incl. projections",
    ],
  },
  {
    icon: Users,
    title: "Point of Sale",
    points: [
      "Multi-restaurant & kitchen management",
      "Tax/price rules, happy hours & freebies",
      "Split bills & guest experience tracking",
      "Non-chargeable KOT support",
    ],
  },
  {
    icon: Boxes,
    title: "Housekeeping",
    points: [
      "Live room status & schedule optimization",
      "Maintenance/lost-and-found tracking",
      "AI complaint triage & remediation tips",
      "Robust reporting for operations",
    ],
  },
];

const secondRow: ModuleCard[] = [
  {
    icon: CreditCard,
    title: "Accounts Receivables",
    points: [
      "Company/TA/group/individual AR management",
      "Automated statements & reminders (multi-format)",
      "Payments, adjustments & credit limits",
      "Aging analysis & dynamic reporting",
    ],
  },
  {
    icon: UtensilsCrossed,
    title: "Food & Beverage Costing",
    points: [
      "Recipe management & cost controls",
      "Usage tracking & waste reduction",
      "Profitability analytics at a glance",
      "Inventory-linked insights",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Purchase & Inventory",
    points: [
      "Automated procurement workflows",
      "Real-time stock visibility",
      "AI-driven demand insights",
      "Waste reduction & tighter control",
    ],
  },
];

// Glass card + icon styles
const glassCard =
  "relative rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.15)] hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)] transition-shadow";

const glassIconWrap =
  "relative flex h-14 w-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-xl border border-white/40 shadow-[0_8px_24px_rgba(31,38,135,0.18)] overflow-hidden";

const rowContainer: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      delay,
      staggerChildren: 0.12,
    },
  }),
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24, mass: 0.6 },
  },
};

export default function ComprehensiveModules() {
  return (
    <section
      id="comprehensive-modules"
      className="w-full px-6 py-20 max-w-6xl mx-auto"
      aria-labelledby="comprehensive-modules-title"
    >
      <motion.h2
        id="comprehensive-modules-title"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl md:text-4xl font-bold tracking-tight text-gray-900"
      >
        Explore Our Comprehensive Modules
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-3 text-center text-gray-600 max-w-3xl mx-auto"
      ></motion.p>

      {/* Row 1: first three cards */}
      <motion.ul
        variants={rowContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        custom={0} // no extra delay for first row
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {firstRow.map(({ icon: Icon, title, points }) => (
          <motion.li
            key={title}
            variants={cardItem}
            whileHover={{ scale: 1.06 }} // grow on hover
            whileTap={{ scale: 0.98 }} // compress on press/click
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.6,
            }}
            className={`${glassCard} p-6 will-change-transform`}
          >
            {/* icon */}
            <div className="mb-5">
              <div className={glassIconWrap}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-60 " />
                <div className="absolute inset-0 rounded-full border border-white/50" />
                <Icon
                  className="relative h-7 w-7 text-blue-700"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-800">
              {points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600/80" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>

      {/* Row 2: next three cards (starts after a slight pause) */}
      <motion.ul
        variants={rowContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        custom={0.25} // slight delay so it follows row 1
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {secondRow.map(({ icon: Icon, title, points }) => (
          <motion.li
            key={title}
            variants={cardItem}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 24,
              mass: 0.6,
            }}
            className={`${glassCard} p-6 will-change-transform`}
          >
            {/* icon */}
            <div className="mb-5">
              <div className={glassIconWrap}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-60" />
                <div className="absolute inset-0 rounded-full border border-white/50" />
                <Icon
                  className="relative h-7 w-7 text-blue-700"
                  strokeWidth={2}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-800">
              {points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600/80" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
