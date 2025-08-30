"use client";

import { motion, type Variants } from "framer-motion";
import {
  Cloud,
  Brain,
  Layers,
  PiggyBank,
  Rocket,
  Settings2,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

type Advantage = { icon: LucideIcon; title: string; desc: string };

const advantages: Advantage[] = [
  {
    icon: Cloud,
    title: "Seamless Cloud Deployment",
    desc: "Access BLUEPMS from anywhere—no servers or IT needed. Legacy tools tie you to on-prem hardware and local networks.",
  },
  {
    icon: Brain,
    title: "AI-Powered Efficiency",
    desc: "Automation for reservations, personalization, predictive maintenance, and insights to anticipate needs.",
  },
  {
    icon: Layers,
    title: "Comprehensive Modules",
    desc: "Front office, POS, housekeeping, AR, F&B costing, purchase, and inventory—everything in one scalable platform.",
  },
  {
    icon: PiggyBank,
    title: "Cost Savings",
    desc: "No upfront infra or license costs. Pay-as-you-go removes expensive upgrades and maintenance fees.",
  },
  {
    icon: Rocket,
    title: "Rapid Implementation",
    desc: "Go live in days, not months. Skip the complex, time-consuming setups of outdated systems.",
  },
  {
    icon: Settings2,
    title: "Completely Flexible System",
    desc: "Adapts to your unique workflows with high reliability, ensuring smooth operations under any workload.",
  },
  {
    icon: BarChart3,
    title: "Dynamic Reporting",
    desc: "200+ reports built-in. Generate insights instantly without waiting for vendor patches or fixes.",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function KeyAdvantages() {
  return (
    <section
      id="key-advantages"
      className="w-full px-6 py-20 max-w-4xl mx-auto"
      aria-labelledby="key-advantages-title"
    >
      <motion.h2
        id="key-advantages-title"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl md:text-4xl font-bold tracking-tight text-gray-900"
      >
        Key Advantages Over Traditional Software
      </motion.h2>

      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 space-y-6"
      >
        {advantages.map(({ icon: Icon, title, desc }) => (
          <motion.li
            key={title}
            variants={item}
            className="flex items-start space-x-4"
          >
            {/* liquid glass icon */}
            <div className="flex-shrink-0 mt-1">
              <div
                className="
                  relative flex h-12 w-12 items-center justify-center
                  rounded-full bg-white/20 backdrop-blur-xl
                  border border-white/30 shadow-[0_8px_24px_rgba(31,38,135,0.18)]
                  overflow-hidden
                "
              >
                {/* glossy gradient overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-60" />
                <div className="absolute inset-0 rounded-full border border-white/50" />
                <Icon
                  className="relative h-6 w-6 text-blue-600 drop-shadow"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* text */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
