"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamsProps {
  className?: string;
  count?: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Beams({ className, count = 5 }: BeamsProps) {
  const beams = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const rand = mulberry32(2024 + i * 97);
        return {
          id: i,
          width: 60 + rand() * 120,
          height: 60 + rand() * 120,
          initial: rand() * 360,
        };
      }),
    [count],
  );

  const placements = [
    "left-[8%] top-[12%]",
    "right-[10%] top-[18%]",
    "left-[20%] bottom-[20%]",
    "right-[24%] bottom-[12%]",
    "left-[45%] top-[6%]",
  ];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {beams.map((beam, i) => (
        <motion.div
          key={beam.id}
          className={cn(
            "absolute rounded-full border-2 border-amber-primary/30 bg-amber-primary/5",
            placements[i % placements.length],
          )}
          style={{ width: beam.width, height: beam.height }}
          animate={{
            rotate: [beam.initial, beam.initial + 90],
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 12 + (i % 5) * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
