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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time metrics and operational status</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} size="sm" className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-card/80 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
