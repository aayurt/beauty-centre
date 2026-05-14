"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

export type AnimationDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "fade"
  | "scaleDown";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  className?: string;
  onClick?: () => void;
  as?: "div" | "section" | "article" | "span";
  once?: boolean;
  amount?: number;
}

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

const variants: Record<AnimationDirection, Variants> = {
  up: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  scaleDown: {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export default function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
  onClick,
  as = "div",
  once = true,
  amount = 0.3,
}: AnimatedSectionProps) {
  const variant = variants[direction];
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variant}
      transition={{
        duration,
        delay,
        ease: defaultEasing,
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </MotionTag>
  );
}

/* --- Compound animation variants --- */

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: defaultEasing,
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: defaultEasing,
    },
  },
};
