"use client";

import { Building2 } from "lucide-react";

export default function TopBar() {
  return (
    // absolute so it belongs only to the first section
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 w-1/2 max-w-3xl">
      <nav
        className="
          flex items-center justify-between
          rounded-full border border-white/30
          bg-white/20 backdrop-blur-xl
          shadow-[0_8px_32px_rgba(31,38,135,0.15)]
          px-8 py-5
        "
      >
        {/* Left: logo + text */}
        <div className="flex items-center gap-2">
          <div
            className="relative flex h-10 w-10 items-center justify-center
                          rounded-full bg-white/40 backdrop-blur-md
                          border border-white/60 shadow-[0_4px_12px_rgba(31,38,135,0.15)]"
          >
            <Building2 className="h-5 w-5 text-blue-700" strokeWidth={2} />
          </div>
          <span className="font-extrabold text-gray-900 text-base">
            BLUEPMS
          </span>
        </div>

        {/* Right: nav links */}
        <div className="flex items-center gap-6 text-sm font-medium text-gray-800">
          <a href="#about" className="hover:text-blue-700 transition-colors">
            About
          </a>
          <a
            href="https://wa.me/14258940847?text=Hi!%20I'm%20interested%20in%20BLUEPMS."
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 transition-colors"
          >
            Contact
          </a>
        </div>
      </nav>
    </div>
  );
}
