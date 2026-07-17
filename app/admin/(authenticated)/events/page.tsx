"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MediaItem {
  id: number;
  imageUrl: string;
  alt: string | null;
}

interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  imageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  media: MediaItem[];
  createdAt: string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/events?activeOnly=false");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) setEvents(json.data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <h1 className="font-serif text-2xl">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {events.length} event{events.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => router.push("/admin/events/new")}>
          <Plus className="size-4" />
          New Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <CalendarIcon className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">No events yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your first event to get started.
          </p>
          <Button onClick={() => router.push("/admin/events/new")}>
            <Plus className="size-4" />
            Create Event
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row">
                {event.imageUrl && (
                  <div className="h-32 shrink-0 bg-muted sm:h-auto sm:w-48">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge
                          variant={
                            event.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.status === "PUBLISHED"
                            ? "Published"
                            : "Draft"}
                        </Badge>
                        {event.media.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {event.media.length} image
                            {event.media.length !== 1 && "s"}
                          </span>
                        )}
                      </div>
                      <h3 className="truncate text-lg font-medium">
                        {event.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {formatDate(event.date)}
                          {event.time && ` at ${event.time}`}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {stripHtml(event.description)}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/events/${event.id}`)
                        }
                        title="Edit event"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        title="Delete event"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  return html.replace(/<[^>]*>/g, "");
}
