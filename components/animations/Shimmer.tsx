"use client";

import { ReactNode, type JSX } from "react";

interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export default function Shimmer({
  width = "100%",
  height = "1em",
  borderRadius = "4px",
  className = "",
  children,
  as: Tag = "div",
}: ShimmerProps) {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
  };

  if (children) {
    return (
      <Tag
        className={`animate-shimmer-slide ${className}`}
        style={style}
        aria-hidden="true"
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      className={`skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
