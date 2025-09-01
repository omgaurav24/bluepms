/* app/page.tsx */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ui/ShinyText"; // ← NEW
import WhyBluepms from "@/app/WhyBluepms";
import KeyAdvantages from "@/app/KeyAdvantages";
import ComprehensiveModules from "@/app/ComprehensiveModules";
import ChooseBluepms from "./ChooseBluepms";
import AboutUsBoxes from "@/app/AboutUs";


export default function Home() {
  const [ctaShown, setCtaShown] = useState(false);
  const router = useRouter();

  const goToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  const goToContact = () => router.push("/contact");

  return (
    <div className="h-screen w-full overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-y-contain">
      {/* HERO */}
      <section className="h-screen snap-start snap-always flex flex-col items-center justify-center text-center px-6">
        <div className="w-full flex flex-col items-center transform-gpu -translate-y-12 md:-translate-y-20 lg:-translate-y-24">
          <motion.h1
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tight relative"
>
  {/* Gradient base (dark top-to-bottom, slightly lighter start) */}
  <span
    className="absolute inset-0 select-none
      bg-gradient-to-b from-[#1B5EC8] via-[#0D47A1] to-[#000814]
      bg-clip-text text-transparent
      [text-shadow:0_1px_2px_rgba(0,0,0,0.15)]"
  >
    BLUEPMS
  </span>

  {/* Shiny overlay (uses your component) */}
  <ShinyText text="BLUEPMS" speed={4} className="relative" />
</motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-[clamp(1.05rem,2.5vw,1.5rem)] font-extrabold text-black"
          >
            <span className="font-medium">AI-Driven.</span>{" "}
            <span className="font-medium">Seamless.</span>{" "}
            <span className="font-medium">Effortlessly Revolutionary.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mt-6 flex flex-col sm:flex-row items-center gap-3"
            onAnimationComplete={() => setCtaShown(true)}
          >
            <Button
              onClick={goToFeatures}
              variant="ghost"
              className="relative h-auto rounded-full px-10 py-4 text-lg font-semibold bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.25)] transform-gpu transition-transform duration-300 ease-out hover:scale-[1.06] active:scale-[0.98] focus-visible:scale-[1.03] focus-visible:outline-none"
            >
              Explore Features
            </Button>

            <Button
              onClick={goToContact}
              variant="ghost"
              className="relative h-auto rounded-full px-10 py-4 text-lg font-semibold bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.25)] transform-gpu transition-transform duration-300 ease-out hover:scale-[1.06] active:scale-[0.98] focus-visible:scale-[1.03] focus-visible:outline-none"
            >
              Go LIVE NOW!
            </Button>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease: "easeOut" }}
            className="mt-4 max-w-3xl text-center text-[clamp(0.95rem,1.6vw,1.15rem)] text-black"
          >
            Transform your hospitality business with a 100% cloud-based,
            AI-integrated property and hotel management platform.
          </motion.p>

          {/* Reserved space prevents re-centering/jitter */}
          <div className="mt-8 w-full">
            <div className="relative mx-auto max-w-5xl min-h-[148px] sm:min-h-[156px] md:min-h-[168px]">
              {ctaShown && (
                <motion.div
                  key="about-boxes"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <AboutUsBoxes immediate />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WHY PAGE */}
      <section id="features" className="h-screen snap-start snap-always flex items-center">
        <WhyBluepms />
      </section>

      {/* KEY ADVANTAGES PAGE */}
      <section className="h-screen snap-start snap-always flex items-center">
        <KeyAdvantages />
      </section>

      {/* COMPREHENSIVE MODULES PAGE */}
      <section className="h-screen snap-start snap-always flex items-center">
        <ComprehensiveModules />
      </section>

      {/* CHOOSE BLUEPMS PAGE */}
      <section className="h-screen snap-start snap-always flex items-center" id="contact">
        <ChooseBluepms />
      </section>
    </div>
  );
}