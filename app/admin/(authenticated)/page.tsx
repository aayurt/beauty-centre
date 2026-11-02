import {
  Calendar,
  Image,
  Inbox,
  MessageSquare,
  Sparkles,
  Users,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Use sequential or batch count queries with fallback to prevent pool exhaustion on pooler connection limit
  let totalServices = 0,
    activeServices = 0,
    totalEvents = 0,
    publishedEvents = 0,
    totalStaff = 0,
    activeStaff = 0,
    totalBookings = 0,
    totalMessages = 0,
    totalMedia = 0,
    totalReviews = 0,
    activeReviews = 0;

  try {
    totalServices = await prisma.service.count();
    activeServices = await prisma.service.count({ where: { isActive: true } });
    totalReviews = await prisma.review.count();
    activeReviews = await prisma.review.count({ where: { isActive: true } });
    totalEvents = await prisma.event.count();
    publishedEvents = await prisma.event.count({ where: { status: "PUBLISHED" } });
    totalStaff = await prisma.staff.count();
    activeStaff = await prisma.staff.count({ where: { isActive: true } });
    totalBookings = await prisma.bookingInquiry.count();
    totalMessages = await prisma.contact.count();
    totalMedia = await prisma.media.count();
  } catch (err) {
    console.error("Dashboard metrics fetch error:", err);
  }

  const stats = [
    { label: "Services", value: totalServices, icon: Sparkles },
    { label: "Active Services", value: activeServices, icon: Sparkles },
    { label: "Reviews", value: totalReviews, icon: Star },
    { label: "Active Reviews", value: activeReviews, icon: Star },
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
