"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const themes = ["light", "dark", "system"] as const
const icons = { light: Sun, dark: Moon, system: Monitor }
const labels = { light: "Light mode", dark: "Dark mode", system: "System theme" }

export default function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", className)}
        aria-label="Toggle theme"
        title="Toggle theme"
      >
        <Sun className="size-4" />
      </Button>
    )
  }

  const current = theme === "system" ? "system" : (theme as "light" | "dark")
  const Icon = icons[current]

  const cycle = () => {
    const idx = themes.indexOf(current)
    setTheme(themes[(idx + 1) % themes.length])
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className={cn("rounded-full", className)}
      aria-label={labels[current]}
      title={labels[current]}
    >
      <Icon className="size-4" />
    </Button>
  )
}
