"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MapPin, Sparkles, Flower2, ScrollText } from "lucide-react";

const taglines = [
  "Where elegance meets expertise",
  "Experience transformative beauty",
  "Your sanctuary of serenity",
  "Luxury redefined, naturally",
];

function useTypewriter(words: string[], typingSpeed = 60, deletingSpeed = 30, pauseDuration = 2500) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      setDisplayText(currentWord.slice(0, displayText.length + 1));
      if (displayText.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      setDisplayText(currentWord.slice(0, displayText.length - 1));
      if (displayText.length === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        return;
      }
    }
  }, [words, wordIndex, isDeleting, displayText, pauseDuration]);

  useEffect(() => {
    const timeout = setTimeout(tick, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return displayText;
}

function FloatingDecorations() {
  return (
    <>
      {/* Top-left sparkle cluster */}
      <div className="absolute top-[15%] left-[8%] z-0 animate-float-drift float-delay-1">
        <div className="relative">
          <Sparkles className="w-8 h-8 text-primary-pink/30" />
          <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary-pink/20 animate-gradient-pulse" />
        </div>
      </div>

      {/* Top-right decorative circle */}
      <div className="absolute top-[20%] right-[12%] z-0 animate-float-sway float-delay-2">
        <div className="w-20 h-20 rounded-full border-2 border-primary-pink/20 animate-float-rotate">
          <div className="absolute inset-3 rounded-full bg-sage-green/10" />
        </div>
      </div>

      {/* Middle-left flower petal */}
      <div className="absolute top-[45%] left-[5%] z-0 animate-float-bob float-delay-3">
        <Flower2 className="w-10 h-10 text-sage-green/20" />
      </div>

      {/* Middle-right ring */}
      <div className="absolute top-[55%] right-[6%] z-0 animate-float-drift float-delay-4">
        <div className="w-16 h-16 rounded-full border border-white/10 backdrop-blur-sm bg-white/5" />
      </div>

      {/* Bottom-left decorative dot */}
      <div className="absolute bottom-[25%] left-[12%] z-0 animate-float-sway float-delay-5">
        <div className="w-4 h-4 rounded-full bg-primary-pink/20" />
      </div>

      {/* Bottom-right sparkle */}
      <div className="absolute bottom-[30%] right-[10%] z-0 animate-float-bob float-delay-1">
        <ScrollText className="w-9 h-9 text-sage-green/15" />
      </div>

      {/* Additional accent dots */}
      <div className="absolute top-[35%] left-[50%] z-0 animate-float-drift float-delay-2">
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>
      <div className="absolute top-[70%] right-[20%] z-0 animate-float-sway float-delay-3">
        <div className="w-3 h-3 rounded-full bg-primary-pink/15" />
      </div>
    </>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.98]);

  const tagline = useTypewriter(taglines);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Animated Gradient Background */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sage-green/90 via-primary-pink/80 to-sage-green-dark/90 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-tr from-sage-green-dark/40 via-transparent to-primary-pink/40 animate-gradient" style={{ animationDirection: "reverse", animationDuration: "20s" }} />
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
      </motion.div>

      {/* Floating Decorative Elements */}
      <FloatingDecorations />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Welcome badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm uppercase tracking-[0.25em] mb-8 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Welcome to
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight"
        >
          K & S Beauty Centre
        </motion.h1>

        {/* Typewriter Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="h-12 md:h-14 flex items-center justify-center mb-10"
        >
          <p className="text-lg md:text-2xl text-white/95 max-w-2xl mx-auto font-light leading-relaxed">
            <span>{tagline}</span>
            <span className="inline-block w-[3px] h-[1.1em] ml-0.5 bg-white/80 rounded-sm animate-cursor-blink align-middle" />
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="#services"
            className="group px-8 py-4 bg-primary-pink text-white rounded-full font-medium text-lg transition-all duration-300 hover:bg-white hover:text-sage-green hover:scale-105 shadow-lg shadow-primary-pink/25"
          >
            Explore Services
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#contact"
            className="px-8 py-4 border-2 border-white/70 text-white rounded-full font-medium text-lg transition-all duration-300 hover:bg-white hover:text-sage-green backdrop-blur-sm"
          >
            Book Appointment
          </Link>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-8 flex items-center justify-center gap-2 text-white/70 text-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>Located in the Heart of Jamal, Kathmandu</span>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/50"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}