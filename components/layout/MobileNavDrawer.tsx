"use client"

import { useCallback } from "react"
import { X } from "lucide-react"

import {
  Drawer,
  DrawerTrigger,
  DrawerPopup,
  DrawerHeader,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useActiveSection } from "@/lib/hooks/useSmoothScroll"
import { useCompany } from "@/lib/company-context"
import { cn } from "@/lib/utils"

export interface MobileNavLink {
  name: string
  href: string
  id: string
}

export interface MobileNavDrawerProps {
  links: MobileNavLink[]
}

export default function MobileNavDrawer({ links }: MobileNavDrawerProps) {
  const sectionIds = links.map((l) => l.id)
  const activeSection = useActiveSection(sectionIds)
  const company = useCompany()

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      const id = href.replace("#", "")
      const el = document.getElementById(id)
      if (el) {
        const offset = 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: "smooth" })
      }
    },
    [],
  )

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </DrawerTrigger>

      <DrawerPopup side="left">
        <DrawerHeader>
          <span className="font-serif text-lg font-bold text-primary">
            {company.name}
          </span>
          <DrawerClose
            data-slot="drawer-close"
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </DrawerClose>
        </DrawerHeader>

        <DrawerContent>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href)
                  closeDrawer(e)
                }}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeSection === link.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </DrawerContent>
      </DrawerPopup>
    </Drawer>
  )
}

function closeDrawer(e: React.MouseEvent<HTMLAnchorElement>) {
  const popup = (e.currentTarget as HTMLElement).closest(
    '[data-slot="drawer-popup"]',
  ) as HTMLElement | null
  if (!popup) return
  const root = popup.closest('[data-slot="drawer"]') as HTMLElement | null
  if (!root) return
  const closeBtn = root.querySelector<HTMLButtonElement>(
    '[data-slot="drawer-close"]',
  )
  closeBtn?.click()
}
