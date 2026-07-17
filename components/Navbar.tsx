"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import ThemeToggle from "@/components/ThemeToggle"
import { useActiveSection } from "@/lib/hooks/useSmoothScroll"
import { useCompany } from "@/lib/company-context"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerTrigger,
  DrawerPopup,
  DrawerHeader,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer"

const navLinks = [
  { name: "Home", href: "#home", id: "home" },
  { name: "About", href: "#about", id: "about" },
  { name: "Services", href: "#services", id: "services" },
  { name: "Gallery", href: "#gallery", id: "gallery" },
  { name: "Location", href: "#location", id: "location" },
  { name: "Team", href: "#team", id: "team" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials" },
  { name: "Contact", href: "#contact", id: "contact" },
]

const sectionIds = navLinks.map((l) => l.id)

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const activeSection = useActiveSection(sectionIds)
  const company = useCompany()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg py-3 dark:bg-neutral-900/95"
          : "bg-transparent py-5",
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="shrink-0"
        >
          <Image
            src="/logo.png"
            alt={company.name}
            width={90}
            height={60}
            priority
            className={cn(
              "h-auto w-auto transition-opacity duration-300",
              isScrolled ? "opacity-100" : "opacity-90 brightness-110 drop-shadow-lg",
            )}
          />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                activeSection === link.id
                  ? "text-primary"
                  : isScrolled
                    ? "text-foreground hover:text-primary active:text-primary/80"
                    : "text-white/90 drop-shadow-md hover:text-white active:text-white/70",
              )}
            >
              {link.name}
              {activeSection === link.id && (
                <motion.span
                  layoutId="nav-active"
                  className={cn(
                    "absolute bottom-0 left-3 right-3 h-0.5 rounded-full",
                    isScrolled ? "bg-primary" : "bg-white",
                  )}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
          <div className="ml-2 flex items-center gap-1">
            <ThemeToggle
              className={cn(
                isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white/80 hover:bg-white/10",
              )}
            />
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className={buttonVariants({
                variant: isScrolled ? "default" : "secondary",
                size: "sm",
              })}
            >
              Book Now
            </a>
          </div>
        </div>

        <Drawer>
          <DrawerTrigger
            data-slot="drawer-trigger"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 md:hidden",
              isScrolled
                ? "text-foreground hover:bg-muted active:bg-muted/80"
                : "text-white hover:bg-white/10 active:bg-white/20",
            )}
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </DrawerTrigger>

          <DrawerPopup side="left">
            <DrawerHeader>
              <Image
                src="/logo.png"
                alt={company.name}
                width={72}
                height={48}
                className="h-auto w-auto"
              />
              <DrawerClose
                data-slot="drawer-close"
                className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close navigation menu"
              >
                <X className="size-5" />
              </DrawerClose>
            </DrawerHeader>

            <DrawerContent>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      handleNavClick(e, link.href)
                      const popup = (
                        e.currentTarget as HTMLElement
                      ).closest('[data-slot="drawer-popup"]') as HTMLElement | null
                      if (!popup) return
                      const root = popup.closest(
                        '[data-slot="drawer"]',
                      ) as HTMLElement | null
                      if (!root) return
                      const closeBtn =
                        root.querySelector<HTMLButtonElement>(
                          '[data-slot="drawer-close"]',
                        )
                      closeBtn?.click()
                    }}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      activeSection === link.id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted active:bg-muted/80",
                    )}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="my-2" />
                <div className="flex items-center gap-2">
                  <ThemeToggle className="text-foreground hover:bg-muted" />
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className={buttonVariants({ variant: "default", size: "default" })}
                  >
                    Book Now
                  </a>
                </div>
              </nav>
            </DrawerContent>
          </DrawerPopup>
        </Drawer>
      </div>
    </motion.nav>
  )
}
