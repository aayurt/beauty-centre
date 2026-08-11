"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
  vertical?: boolean;
}

export function Marquee({
  className,
  children,
  reverse = false,
  pauseOnHover = false,
  speed = 30,
  vertical = false,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--duration:40s] [--gap:1rem]",
        vertical && "h-full flex-col",
        className,
      )}
      style={{ ["--duration" as string]: `${speed}s` }}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical && "flex-col",
            reverse && "animate-marquee-reverse",
            !reverse && "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export function MarqueeItem({ children }: { children: React.ReactNode }) {
  return <div className="mx-[var(--gap)] shrink-0">{children}</div>;
}
