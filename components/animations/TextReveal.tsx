"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ElementType, type ReactNode } from "react";

interface TextRevealProps {
  text?: string;
  children?: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  wordDuration?: number;
  once?: boolean;
}

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

export default function TextReveal({
  text,
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  wordDuration = 0.04,
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.3 });

  if (children) {
    return (
      <Tag ref={ref} className={className}>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay, ease: defaultEasing }}
        >
          {children}
        </motion.span>
      </Tag>
    );
  }

  if (!text) return null;

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, rotateX: 0 }
                : { opacity: 0, y: 20, rotateX: -90 }
            }
            transition={{
              duration: 0.5,
              delay: delay + i * wordDuration,
              ease: defaultEasing,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
