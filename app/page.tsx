"use client";

import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import WhyBluepms from "@/app/WhyBluepms";
import KeyAdvantages from "@/app/KeyAdvantages";
import ComprehensiveModules from "@/app/ComprehensiveModules";
import ChooseBluepms from "./ChooseBluepms";
import TopBar from "@/app/TopBar";

export default function Home() {
  const goToFeatures = () =>
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  return (
    <BackgroundGradientAnimation className="h-screen w-full overflow-y-auto scroll-smooth snap-y snap-mandatory overscroll-y-contain">
      {/* TITLE PAGE */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-6">
        <TopBar />

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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-10"
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
        </motion.div>
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
      <section className="h-screen snap-start flex items-center">
        <ChooseBluepms />
      </section>
    </BackgroundGradientAnimation>
  );
}
