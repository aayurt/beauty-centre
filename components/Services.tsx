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
  facials: "Facials & Skin",
  nails: "Nails & Lash",
  massage: "Massage & Spa",
  bridal: "Bridal Packages",
};

const CATEGORY_ORDER = ["hair", "facials", "nails", "massage", "bridal"];

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
          <span className="inline-block px-4 py-2 bg-white dark:bg-neutral-800 text-amber-primary rounded-full text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Pamper Yourself with{" "}
            <span className="text-amber-primary">Luxury Treatments</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Discover our comprehensive range of beauty and wellness services,
            designed to help you look and feel your absolute best.
          </p>
        </AnimatedSection>

        {grouped.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Loading services…
          </p>
        ) : (
          <Tabs defaultValue={firstCategory}>
            <TabsList className="mx-auto mb-10 flex flex-wrap h-auto w-auto gap-1 bg-white/70 dark:bg-neutral-800/70 p-1.5 rounded-full backdrop-blur-sm">
              {grouped.map(([category]) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-full px-4 py-1.5 capitalize"
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
                      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <span className="flex size-11 items-center justify-center rounded-full bg-amber-primary/10 text-amber-primary">
                          <Sparkles className="size-5" />
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-foreground mb-1">
                        {svc.title}
                      </h3>
                      {svc.duration && (
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
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
                              className="flex items-center gap-2 text-xs text-foreground"
                            >
                              <span className="size-1.5 shrink-0 rounded-full bg-amber-primary" />
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
                          "justify-start self-start rounded-full px-3 text-amber-primary hover:bg-amber-primary/10 hover:text-amber-primary",
                        )}
                      >
                        Book This Service
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
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
