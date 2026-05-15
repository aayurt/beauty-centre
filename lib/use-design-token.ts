"use client"

import { useCallback } from "react"
import type { SemanticColors } from "./design-tokens"

type SemanticColorName = keyof SemanticColors;

const camelToKebab = (s: string) =>
  s.replace(/([A-Z])/g, "-$1").toLowerCase();

export function useDesignToken(token: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim()
}

export function useDesignTokens() {
  const getToken = useCallback((token: string) => {
    if (typeof window === "undefined") return ""
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  }, [])

  const getSemanticColor = useCallback(
    (name: SemanticColorName) => {
      return getToken(`--${camelToKebab(name)}`)
    },
    [getToken]
  )

  return { getToken, getSemanticColor }
}
