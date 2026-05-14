"use client";

import { motion } from "framer-motion";
import { ReactNode, Children, isValidElement } from "react";

interface StaggerCardsProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  once?: boolean;
  amount?: number;
}

const directionVariants = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  fade: { y: 0 },
};

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

export default function StaggerCards({
  children,
  className = "",
  staggerDelay = 0.15,
  duration = 0.6,
  direction = "up",
  once = true,
  amount = 0.1,
}: StaggerCardsProps) {
  const items = Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
    >
      {items.map((child, index) => {
        const isMotion = isValidElement(child) && child.type === motion.div;
        if (isMotion) return child;

        return (
          <motion.div
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                ...directionVariants[direction],
                scale: 0.97,
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                transition: {
                  duration,
                  ease: defaultEasing,
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
