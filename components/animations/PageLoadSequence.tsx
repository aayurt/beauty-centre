"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode, useEffect, useState } from "react";
import { useAnimationContext } from "./AnimationProvider";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type Phase = "enter" | "settle" | "done";

interface PageLoadSequenceProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

function buildVariants(
  distance: number,
  duration: number,
  delay: number,
): Variants {
  return {
    hidden: {
      opacity: 0,
      y: distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: defaultEasing,
      },
    },
  };
}

export default function PageLoadSequence({
  children,
  className = "",
  delay = 0.15,
  duration = 0.7,
  distance = 30,
}: PageLoadSequenceProps) {
  const { pageLoaded, reduced: ctxReduced } = useAnimationContext();
  const hookReduced = useReducedMotion();
  const reduced = ctxReduced || hookReduced;
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    if (reduced) {
      const timer = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(timer);
    }

    if (pageLoaded) {
      const timer = setTimeout(() => setPhase("settle"), (delay + duration) * 1000);
      const doneTimer = setTimeout(() => setPhase("done"), (delay + duration) * 1000 + 300);
      return () => {
        clearTimeout(timer);
        clearTimeout(doneTimer);
      };
    }
  }, [pageLoaded, reduced, delay, duration]);

  const variants = buildVariants(distance, duration, delay);

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={pageLoaded ? "visible" : "hidden"}
      variants={variants}
      style={
        phase === "settle" || phase === "done"
          ? { opacity: 1, y: 0 }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
