"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Service {
  id: number;
  title: string;
  category: string;
  price: string;
  duration: string;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  hair: "Hair Care",
  facials: "Facials & Skin",
  nails: "Nails & Lash",
  massage: "Massage & Spa",
  bridal: "Bridal Packages",
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/services?activeOnly=false");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) setServices(json.data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load services",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete service");
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => router.push("/admin/services/new")}>
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Scissors className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">No services yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Add your first service to get started.
          </p>
          <Button onClick={() => router.push("/admin/services/new")}>
            <Plus className="size-4" />
            Add Service
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 border-b bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Scissors className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="truncate text-base font-medium">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[service.category] ?? service.category}
                    </p>
                  </div>
                </div>
                {!service.isActive && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <div className="p-4">
                {service.duration && (
                  <p className="text-sm text-muted-foreground">
                    Duration: {service.duration}
                  </p>
                )}
                {service.price && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Price: {service.price}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    Order: {service.displayOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/services/${service.id}`)
                      }
                      title="Edit service"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                      title="Delete service"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
