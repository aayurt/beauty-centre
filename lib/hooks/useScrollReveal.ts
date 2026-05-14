"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  disabled?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -60px 0px",
    once = true,
    disabled = false,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove("is-revealed");
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once, disabled]);

  return ref;
}
