"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, Sparkles as SparklesIcon } from "lucide-react";
import { useCompany } from "@/lib/company-context";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/button";
import { Beams } from "@/components/effects/Beams";
import { Sparkles } from "@/components/effects/Sparkles";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const company = useCompany();
  const { openBooking } = useBooking();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.98]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Animated Gradient Background */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-primary/90 via-rose-secondary/80 to-amber-dark/90 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-dark/40 via-transparent to-rose-secondary/40 animate-gradient" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </motion.div>

      {/* Hand-rolled Aceternity-style effects */}
      <Beams className="z-0" count={5} />
      <Sparkles className="z-0" count={28} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-28 pb-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-900/10 backdrop-blur-sm border border-amber-900/20 text-amber-900/90 dark:bg-white/10 dark:border-white/20 dark:text-white/90 text-sm uppercase tracking-[0.25em] mb-8 font-medium"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Welcome to
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary mb-6 leading-tight"
        >
          K &amp; S Beauty Centre
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-base sm:text-lg md:text-2xl text-amber-900/95 dark:text-white/95 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          Elevate your everyday radiance with hair, skin &amp; wellness artistry
          crafted around you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => openBooking()}
            className="rounded-full px-8 py-4 h-auto text-base sm:text-lg shadow-lg shadow-primary/25"
          >
            Book Appointment
            <SparklesIcon className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
            }}
            className="rounded-full px-8 py-4 h-auto text-base sm:text-lg border-2 border-amber-900/70 text-amber-900 dark:border-white/70 dark:text-white dark:hover:bg-white dark:hover:text-primary backdrop-blur-sm"
          >
            Explore Services
            <span aria-hidden>→</span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-amber-900/80 dark:text-white/70 text-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>{company.address.split("\n")[0]}</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-amber-900/60 dark:text-white/50"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 border-2 border-amber-900/50 rounded-full flex items-start justify-center p-1.5 dark:border-white/40">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-amber-900/70 rounded-full dark:bg-white/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
