"use client";

import { motion } from "framer-motion";
import { Cloud, Brain, Zap, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "100% Cloud-Based",
    text: "No costly on-premise installations, complex setups, or ongoing maintenance.",
  },
  {
    icon: Brain,
    title: "AI-Integrated",
    text: "Smart, data-driven property and hotel management powered by AI.",
  },
  {
    icon: Zap,
    title: "Plug-and-Play",
    text: "Zero infrastructure expenses, empowering hoteliers and managers instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Future-Proof",
    text: "Seamless scalability from boutique hotels to large resorts with efficiency and guest satisfaction.",
  },
];

export default function WhyBluepms() {
  return (
    <section
      id="features"
      className="min-h-screen snap-start flex flex-col items-center justify-center px-6 py-20"
    >
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-10 text-center text-4xl font-bold tracking-tight text-gray-900"
      >
        Why <span>BLUEPMS</span> is the Future of Hospitality Management
      </motion.h2>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{
                delay: index * 0.2,
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
              className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.2)] overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-50" />
              <div className="absolute inset-0 rounded-full border border-white/40" />
              <feature.icon
                className="relative h-8 w-8 !text-blue-600 drop-shadow-md"
                strokeWidth={2}
              />
            </motion.div>

            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-700">{feature.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
