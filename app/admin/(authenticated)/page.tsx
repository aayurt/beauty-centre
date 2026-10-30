import {
  Calendar,
  Image,
  Inbox,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalServices,
    activeServices,
    totalEvents,
    publishedEvents,
    totalStaff,
    activeStaff,
    totalBookings,
    totalMessages,
    totalMedia,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.staff.count(),
    prisma.staff.count({ where: { isActive: true } }),
    prisma.bookingInquiry.count(),
    prisma.contact.count(),
    prisma.media.count(),
  ]);

  const stats = [
    { label: "Services", value: totalServices, icon: Sparkles },
    { label: "Active Services", value: activeServices, icon: Sparkles },
    { label: "Events", value: totalEvents, icon: Calendar },
    { label: "Published Events", value: publishedEvents, icon: Calendar },
    { label: "Staff", value: totalStaff, icon: Users },
    { label: "Active Staff", value: activeStaff, icon: Users },
    { label: "Booking Requests", value: totalBookings, icon: Inbox },
    { label: "Contact Messages", value: totalMessages, icon: MessageSquare },
    { label: "Media Items", value: totalMedia, icon: Image },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time metrics and operational status</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} size="sm" className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-card/80 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-4xl font-extrabold font-serif text-foreground">{stat.value}</p>
                </div>
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/20 text-amber-500 shadow-inner">
                  <Icon className="size-7" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
