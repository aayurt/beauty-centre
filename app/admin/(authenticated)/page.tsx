import { Calendar, Image } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalEvents, publishedEvents, totalMedia] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.media.count(),
  ]);

  const stats = [
    { label: "Total Events", value: totalEvents, icon: Calendar },
    { label: "Published", value: publishedEvents, icon: Calendar },
    { label: "Media Items", value: totalMedia, icon: Image },
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
