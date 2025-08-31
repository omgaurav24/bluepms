/* app/page.tsx */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import WhyBluepms from "@/app/WhyBluepms";
import KeyAdvantages from "@/app/KeyAdvantages";
import ComprehensiveModules from "@/app/ComprehensiveModules";
import ChooseBluepms from "./ChooseBluepms";
import AboutUsBoxes from "@/app/AboutUs";

export default function Home() {
  const [ctaShown, setCtaShown] = useState(false);

  const goToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  const goToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else if (typeof window !== "undefined") {
      window.location.href = "mailto:hello@bluepms.com";
    }
  };

  return (
    <BackgroundGradientAnimation className="h-screen w-full overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-y-contain">
      {/* HERO */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-6">
        {/* ↑ lift the whole hero content more */}
        <div className="w-full flex flex-col items-center transform-gpu -translate-y-12 md:-translate-y-20 lg:-translate-y-24">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[clamp(3rem,8vw,6rem)] font-extrabold tracking-tight text-gray-900"
          >
            BLUEPMS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-[clamp(1.05rem,2.5vw,1.5rem)] font-extrabold text-gray-700"
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
              className="
                relative h-auto rounded-full px-10 py-4 text-lg font-semibold
                bg-white/20 backdrop-blur-xl border border-white/30
                text-blue-700 hover:text-blue-800 hover:bg-white/30
                shadow-[0_8px_32px_rgba(31,38,135,0.25)]
                transform-gpu will-change-transform
                transition-transform duration-300 ease-out
                hover:scale-[1.06] active:scale-[0.98]
                focus-visible:scale-[1.03] focus-visible:outline-none
              "
            >
              Explore Features
            </Button>

            <Button
              onClick={goToContact}
              variant="ghost"
              className="
                relative h-auto rounded-full px-10 py-4 text-lg font-semibold
                bg-white/20 backdrop-blur-xl border border-white/30
                text-blue-700 hover:text-blue-800 hover:bg-white/30
                shadow-[0_8px_32px_rgba(31,38,135,0.25)]
                transform-gpu will-change-transform
                transition-transform duration-300 ease-out
                hover:scale-[1.06] active:scale-[0.98]
                focus-visible:scale-[1.03] focus-visible:outline-none
              "
            >
              Get in Touch
            </Button>
          </motion.div>

          {/* New subheadline under the buttons */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55, ease: "easeOut" }}
            className="mt-4 max-w-3xl text-center text-[clamp(0.95rem,1.6vw,1.15rem)] text-gray-700"
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
      <section id="features" className="h-screen snap-start flex items-center">
        <WhyBluepms />
      </section>

      {/* KEY ADVANTAGES PAGE */}
      <section className="h-screen snap-start flex items-center">
        <KeyAdvantages />
      </section>

      {/* COMPREHENSIVE MODULES PAGE */}
      <section className="h-screen snap-start flex items-center">
        <ComprehensiveModules />
      </section>

      {/* CHOOSE BLUEPMS PAGE */}
      <section className="h-screen snap-start flex items-center" id="contact">
        <ChooseBluepms />
      </section>
    </BackgroundGradientAnimation>
  );
}
