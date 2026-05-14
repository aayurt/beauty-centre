"use client";

import { useCallback, useEffect, useState } from "react";

export interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

const NAVBAR_HEIGHT = 80;

export function useSmoothScroll(options: ScrollOptions = {}) {
  const { offset = NAVBAR_HEIGHT, behavior = "smooth" } = options;

  const scrollTo = useCallback(
    (target: string | HTMLElement) => {
      const element =
        typeof target === "string"
          ? document.querySelector<HTMLElement>(target)
          : target;

      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior });
    },
    [offset, behavior],
  );

  return { scrollTo };
}

export interface ActiveSection {
  id: string;
  ratio: number;
}

export function useActiveSection(
  sectionIds: string[],
  rootMargin = `-${NAVBAR_HEIGHT + 20}px 0px -40% 0px`,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const entriesMap = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entriesMap.set(entry.target.id, entry);
        }

        let maxRatio = 0;
        let bestId: string | null = null;

        for (const id of sectionIds) {
          const entry = entriesMap.get(id);
          if (entry && entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            bestId = id;
          }
        }

        setActiveId((prev) => (bestId ?? prev));
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin,
      },
    );

    const elements: (Element | null)[] = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        if (el) observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [sectionIds, rootMargin]);

  return activeId;
}
