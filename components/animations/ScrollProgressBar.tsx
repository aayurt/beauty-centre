"use client";

import { motion, useSpring } from "framer-motion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface ScrollProgressBarProps {
  className?: string;
  color?: string;
  height?: number;
  zIndex?: number;
}

export default function ScrollProgressBar({
  className = "",
  color,
  height = 3,
  zIndex = 60,
}: ScrollProgressBarProps) {
  const rawProgress = useScrollProgress();
  const reduced = useReducedMotion();

  const springProgress = useSpring(rawProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className={`scroll-progress-bar ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height,
        zIndex,
        transformOrigin: "0% 50%",
        backgroundColor: color ? color : undefined,
        scaleX: springProgress,
      }}
      aria-hidden="true"
    />
  );
}
