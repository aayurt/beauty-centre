"use client"

import { X, LogOut, Scissors, LayoutDashboard, Calendar, Users, Inbox, Camera, Image, Building2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

import {
  Drawer,
  DrawerTrigger,
  DrawerPopup,
  DrawerHeader,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import AdminSidebar from "@/app/admin/(authenticated)/AdminSidebar"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  Users,
  Inbox,
  Camera,
  Image,
  Building2,
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/events", label: "Events", icon: "Calendar" },
  { href: "/admin/staff", label: "Staff", icon: "Users" },
  { href: "/admin/bookings", label: "Inquiries", icon: "Inbox" },
  { href: "/admin/instagram", label: "Instagram", icon: "Camera" },
  { href: "/admin/gallery", label: "Gallery", icon: "Image" },
  { href: "/admin/organization", label: "Organization", icon: "Building2" },
]

function MobileAdminDrawer() {
  const pathname = usePathname()

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open admin menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </DrawerTrigger>

      <DrawerPopup side="left">
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Scissors className="size-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">K &amp; S Beauty</span>
          </div>
          <DrawerClose
            data-slot="drawer-close"
            className="inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close admin menu"
          >
            <X className="size-5" />
          </DrawerClose>
        </DrawerHeader>

        <DrawerContent>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              const Icon = iconMap[item.icon]

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    const popup = (e.currentTarget as HTMLElement).closest(
                      '[data-slot="drawer-popup"]',
                    ) as HTMLElement | null
                    if (!popup) return
                    const root = popup.closest(
                      '[data-slot="drawer"]',
                    ) as HTMLElement | null
                    if (!root) return
                    const closeBtn = root.querySelector<HTMLButtonElement>(
                      '[data-slot="drawer-close"]',
                    )
                    closeBtn?.click()
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  {item.label}
                </Link>
              )
            })}
            <div className="my-2 border-t" />
            <MobileLogoutButton />
          </nav>
        </DrawerContent>
      </DrawerPopup>
    </Drawer>
  )
}

function MobileLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
    >
      <LogOut className="size-4 shrink-0" />
      Sign out
    </button>
  )
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/50">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b bg-card px-4 py-3 lg:hidden">
        <MobileAdminDrawer />
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
            <Scissors className="size-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>
      </div>

      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      <main className="p-4 pt-4 lg:ml-64 lg:p-8">{children}</main>
    </div>
  )
}
