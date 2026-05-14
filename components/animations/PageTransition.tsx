"use client";

import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export default function PageTransition({
  children,
  className = "",
  duration,
}: PageTransitionProps) {
  const transition: Transition | undefined = duration
    ? {
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }
    : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
