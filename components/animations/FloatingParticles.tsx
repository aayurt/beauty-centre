"use client";

import { useMemo, type JSX, type CSSProperties } from "react";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  shape: "circle" | "ring" | "sparkle";
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

function SparkleIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M12 0l1.5 8.5L22 6l-6.5 5.5L22 18l-8.5-2.5L12 24l-1.5-8.5L2 18l6.5-5.5L2 6l8.5 2.5L12 0z" />
    </svg>
  );
}

export default function FloatingParticles({
  count = 8,
  className = "",
}: FloatingParticlesProps) {
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 4 + (i % 3) * 4,
        x: (i * 17 + 5) % 100,
        y: (i * 23 + 11) % 100,
        duration: 5 + (i % 4) * 2,
        delay: -(i % 5) * 1.2,
        opacity: 0.08 + (i % 4) * 0.04,
        shape: (["circle", "ring", "sparkle"] as const)[i % 3],
      })),
    [count],
  );

  const renderParticle = (p: Particle): JSX.Element => {
    const key = `particle-${p.id}`;

    if (p.shape === "sparkle") {
      return (
        <div
          key={key}
          className="absolute animate-float-sway"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
          aria-hidden="true"
        >
          <SparkleIcon
            className="text-sage-green animate-float-rotate"
            style={{
              width: p.size + 4,
              height: p.size + 4,
              opacity: p.opacity,
              animationDuration: `${p.duration * 2}s`,
            }}
          />
        </div>
      );
    }

    if (p.shape === "ring") {
      return (
        <div
          key={key}
          className="absolute animate-float-drift"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
          aria-hidden="true"
        >
          <div
            className="rounded-full border border-primary-pink animate-float-rotate"
            style={{
              width: p.size + 8,
              height: p.size + 8,
              opacity: p.opacity,
              animationDuration: `${p.duration * 3}s`,
            }}
          />
        </div>
      );
    }

    return (
      <div
        key={key}
        className="absolute animate-float-bob"
        style={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }}
        aria-hidden="true"
      >
        <div
          className="rounded-full bg-primary-pink"
          style={{
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      </div>
    );
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {particles.map(renderParticle)}
    </div>
  );
}
