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
    <div>
      <h1 className="mb-6 font-serif text-2xl">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
                </div>
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
