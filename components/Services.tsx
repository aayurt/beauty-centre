"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import AnimatedSection from "./animations/AnimatedSection";
import { useBooking } from "@/components/booking/BookingProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
  imageUrl: string | null;
  features: string[];
  category: string;
  duration: string;
  price: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hair: "Hair Care",
  skincare: "Skincare & Facials",
  waxing: "Waxing",
  nails: "Nails & Spa",
  bridal: "Bridal Packages",
};

const CATEGORY_ORDER = ["hair", "skincare", "waxing", "nails", "bridal"];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const { openBooking } = useBooking();

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setServices(json.data);
      })
      .catch(() => {});
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Service[]>();
    for (const svc of services) {
      const list = map.get(svc.category) ?? [];
      list.push(svc);
      map.set(svc.category, list);
    }
    const entries = Array.from(map.entries());
    entries.sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]),
    );
    return entries;
  }, [services]);

  const firstCategory = grouped[0]?.[0] ?? "hair";

  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-rose-light dark:bg-neutral-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Luxury Treatments for Hair, Skin &amp; Body
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Discover our masterfully curated salon services in Jamal, Kathmandu.
          </p>
        </AnimatedSection>

        {grouped.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Loading services…
          </p>
        ) : (
          <Tabs defaultValue={firstCategory}>
            <TabsList className="mx-auto mb-10 flex flex-wrap h-auto w-auto gap-2 bg-white/70 dark:bg-neutral-800/60 p-2 rounded-full backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5">
              {grouped.map(([category]) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-amber-500/20 capitalize"
                >
                  {CATEGORY_LABELS[category] ?? category}
                </TabsTrigger>
              ))}
            </TabsList>

            {grouped.map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {items.map((svc) => (
                    <motion.div
                      key={svc.id}
                      variants={cardVariants}
                      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg p-6 shadow-md ring-1 ring-black/5 dark:ring-white/10 hover:ring-amber-500/30 dark:hover:ring-amber-400/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="size-5" />
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-foreground mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {svc.title}
                      </h3>
                      {svc.duration && (
                        <p className="text-xs font-semibold text-muted-foreground mb-3">
                          {svc.duration}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                        {svc.description}
                      </p>

                      {svc.features.length > 0 && (
                        <ul className="mb-5 space-y-1.5">
                          {svc.features.slice(0, 3).map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-2 text-xs text-foreground/90"
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openBooking(svc.title)}
                        className={cn(
                          "justify-start self-start rounded-full px-4 py-2 font-medium text-amber-600 dark:text-amber-400 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-rose-500/10 group-hover:translate-x-1 transition-all",
                        )}
                      >
                        Book This Service
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}
