"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building2,
  Calendar,
  Camera,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Scissors,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/bookings", label: "Inquiries", icon: Inbox },
  { href: "/admin/instagram", label: "Instagram", icon: Camera },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/organization", label: "Organization", icon: Building2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary">
            <Scissors className="size-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight">
              K &amp; S Beauty
            </h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isActive
                  ? "bg-primary/10 text-primary active:bg-primary/15"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
