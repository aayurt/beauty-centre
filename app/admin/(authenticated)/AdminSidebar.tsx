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
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/services", label: "Services", icon: Sparkles },
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
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/20 dark:border-white/5 bg-card/70 backdrop-blur-xl shadow-xl shadow-black/5">
      <div className="border-b border-border/50 p-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
            <Scissors className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold font-serif leading-tight text-foreground">
              K &amp; S Beauty
            </h1>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Admin Portal</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
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
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-300 outline-none",
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20"
                  : "text-muted-foreground hover:bg-white/60 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-1",
              )}
            >
              <Icon className={cn("size-4 shrink-0", isActive ? "text-white" : "text-amber-500")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-2xl px-3.5 py-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
