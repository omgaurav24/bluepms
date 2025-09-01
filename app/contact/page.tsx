/* app/contact/page.tsx */
"use client";

import React, { useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const WA_NUMBER = "14258940847";

/* Animations */
const cardVariants: Variants = {
  initial: { opacity: 0, y: 22, scale: 0.985 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};
const fieldsContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delay: 0.15, staggerChildren: 0.08 },
  },
};
const fieldItem: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false); // <-- only show error after blur
  const [message, setMessage] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // message min length is 1
  const canSubmit = useMemo(
    () => name.trim().length > 0 && isValidEmail(email) && message.trim().length > 0,
    [name, email, message]
  );

  const waHref = useMemo(() => {
    const text = encodeURIComponent(
      `Hi BLUEPMS,\n\nMy name is ${name}.\nEmail: ${email}\n\nMessage:\n${message}`
    );
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  }, [name, email, message]);

  const onSubmit = async () => {
    if (!canSubmit) return;
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      alert("Thanks! We’ll reach out shortly.");
      setName(""); setEmail(""); setMessage("");
      setEmailTouched(false);
    } else {
      const t = await res.text();
      alert("Something went wrong: " + t);
    }
  };

  const onWhatsApp = () => {
    if (!canSubmit) return;
    window.open(waHref, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-[100svh] w-full flex items-center justify-center px-6 py-16">
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="
          relative z-10 w-full max-w-3xl
          rounded-3xl
          px-6 py-8 md:px-10 md:py-10
          bg-white/20 backdrop-blur-xl border border-white/25
          shadow-[0_8px_32px_rgba(31,38,135,0.25)]
        "
      >
        {/* subtle rim softener */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(255,255,255,0.12)",
          }}
        />

        <div className="relative">
          {/* 1) Title changed */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 text-center"
          >
            Get in Touch
          </motion.h1>

          {/* 2) Tagline replaced */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
            className="mt-2 text-center text-gray-700"
          >
            100% cloud-based, 0% hassle—powered by AI.
            Let’s reimagine hospitality together.
          </motion.p>

          <motion.form
            variants={fieldsContainer}
            initial="initial"
            animate="animate"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="mt-8 grid grid-cols-1 gap-5"
          >
            {/* Name */}
            <motion.label variants={fieldItem} className="block">
              <span className="text-sm font-medium text-gray-800">Name</span>
              <div className="relative mt-1">
                <input
                  type="text"
                  className="
                    peer relative w-full rounded-2xl
                    border border-white/25 bg-white/10
                    px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none
                    focus-visible:ring-2 focus-visible:ring-white/60
                    transition-shadow
                  "
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                {/* focus halo */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 peer-focus:opacity-100 transition-opacity"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.45), 0 6px 18px rgba(15,25,35,0.12)",
                  }}
                />
              </div>
            </motion.label>

            {/* Email (error only after blur) */}
            <motion.label variants={fieldItem} className="block">
              <span className="text-sm font-medium text-gray-800">Email</span>
              <div className="relative mt-1">
                <input
                  type="email"
                  className="
                    peer relative w-full rounded-2xl
                    border border-white/25 bg-white/10
                    px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none
                    focus-visible:ring-2 focus-visible:ring-white/60
                    transition-shadow
                  "
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}         
                  required
                  autoComplete="email"
                  aria-invalid={emailTouched && email.length > 0 && !isValidEmail(email)}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 peer-focus:opacity-100 transition-opacity"
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.45), 0 6px 18px rgba(15,25,35,0.12)",
                  }}
                />
              </div>

              {/* centered + gentle color; only when blurred */}
              {emailTouched && email.length > 0 && !isValidEmail(email) && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-center text-rose-500/90"
                  role="status"
                  aria-live="polite"
                >
                  Please enter a valid email address.
                </motion.p>
              )}
            </motion.label>

            {/* Message (fixed size + edge border) */}
            <motion.label variants={fieldItem} className="block">
              <span className="text-sm font-medium text-gray-800">Message</span>
              <div className="relative mt-1">
                <textarea
                  className="
                    relative w-full rounded-2xl
                    border border-white/25 bg-white/10
                    px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none
                    focus-visible:ring-2 focus-visible:ring-white/60
                    transition-shadow resize-none
                    h-40 md:h-48
                  "
                  placeholder="Please tell us about your requirements"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </motion.label>

            {/* Actions */}
            <motion.div
              variants={fieldItem}
              className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <Button
                type="button"
                onClick={onWhatsApp}
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                className="
                  w-full rounded-full px-6 py-3 font-semibold
                  bg-white/20 backdrop-blur-xl border border-white/25
                  hover:bg-white/30 transition
                  disabled:opacity-50 disabled:pointer-events-none
                  shadow-[0_8px_32px_rgba(31,38,135,0.20)]
                "
              >
                <motion.span whileTap={{ scale: canSubmit ? 0.98 : 1 }}>
                  WhatsApp
                </motion.span>
              </Button>

              <Button
                type="submit"
                disabled={!canSubmit}
                aria-disabled={!canSubmit}
                className="
                  w-full rounded-full px-6 py-3 font-semibold
                  bg-white/20 backdrop-blur-xl border border-white/25
                  hover:bg-white/30 transition
                  disabled:opacity-50 disabled:pointer-events-none
                  shadow-[0_8px_32px_rgba(31,38,135,0.20)]
                "
              >
                <motion.span whileTap={{ scale: canSubmit ? 0.98 : 1 }}>
                  Get a callback
                </motion.span>
              </Button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}