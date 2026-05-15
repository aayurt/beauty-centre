import { ReactNode } from "react";

/* --- Primitive Skeleton Blocks --- */

interface SkeletonBlockProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

function SkeletonBlock({
  className = "",
  width,
  height,
}: SkeletonBlockProps) {
  const style: React.CSSProperties = {
    ...(width ? { width: typeof width === "number" ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === "number" ? `${height}px` : height } : {}),
  };

  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
}

/* --- Composed Skeleton Components --- */

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps) {
  return (
    <div className={className} aria-hidden="true" role="presentation">
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-text ${i === lines - 1 ? "" : ""}`}
          style={i === lines - 1 ? { width: "60%" } : undefined}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  children?: ReactNode;
}

function SkeletonCard({ className = "", children }: SkeletonCardProps) {
  return (
    <div className={`skeleton-card ${className}`} aria-hidden="true">
      {children || (
        <>
          <div className="skeleton skeleton-image" />
          <div className="mt-4">
            <SkeletonText lines={3} />
          </div>
        </>
      )}
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: number;
  className?: string;
}

function SkeletonAvatar({ size = 48, className = "" }: SkeletonAvatarProps) {
  return (
    <div
      className={`skeleton skeleton-avatar ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/* --- Skeleton Table / Row --- */

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

function SkeletonTable({
  rows = 3,
  columns = 4,
  className = "",
}: SkeletonTableProps) {
  return (
    <div className={className} aria-hidden="true" role="presentation">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex gap-4 mb-3">
          {Array.from({ length: columns }, (_, c) => (
            <div
              key={c}
              className="skeleton flex-1"
              style={{ height: "1em" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export {
  SkeletonBlock,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonTable,
};
