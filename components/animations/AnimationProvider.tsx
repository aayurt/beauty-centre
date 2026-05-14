"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface AnimationContextValue {
  reduced: boolean;
  pageLoaded: boolean;
  registerLoad: () => void;
}

const AnimationContext = createContext<AnimationContextValue | null>(null);

export function useAnimationContext(): AnimationContextValue {
  const ctx = useContext(AnimationContext);
  if (!ctx) {
    throw new Error(
      "useAnimationContext must be used within an AnimationProvider",
    );
  }
  return ctx;
}

interface AnimationProviderProps {
  children: ReactNode;
}

export default function AnimationProvider({
  children,
}: AnimationProviderProps) {
  const reduced = useReducedMotion();
  const [pageLoaded, setPageLoaded] = useState(false);

  const registerLoad = useCallback(() => setPageLoaded(true), []);

  useEffect(() => {
    if (document.readyState === "complete") {
      const timer = setTimeout(registerLoad, 0);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener("load", registerLoad);
      return () => window.removeEventListener("load", registerLoad);
    }
  }, [registerLoad]);

  return (
    <AnimationContext.Provider value={{ reduced, pageLoaded, registerLoad }}>
      {children}
    </AnimationContext.Provider>
  );
}
