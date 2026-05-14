"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right";
  width?: string;
  className?: string;
  title?: string;
  closeOnBackdrop?: boolean;
}

const sideVariants = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  },
};

export default function SlidePanel({
  open,
  onClose,
  children,
  side = "right",
  width = "400px",
  className = "",
  title,
  closeOnBackdrop = true,
}: SlidePanelProps) {
  const variant = sideVariants[side];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 bg-black"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Panel */}
          <motion.aside
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            className={`fixed top-0 bottom-0 z-50 bg-white shadow-2xl overflow-y-auto ${className}`}
            style={{
              [side]: 0,
              width,
              maxWidth: "100vw",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Slide panel"}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="text-lg font-serif font-bold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Close button when no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <div className={title ? "" : "p-6"}>{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
