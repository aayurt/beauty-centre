"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "../../components/RichTextEditor";
import MediaGallery from "../../components/MediaGallery";
import ImageUploader from "@/components/ImageUploader";

interface MediaItem {
  id?: number;
  imageUrl: string;
  alt?: string;
  caption?: string;
  displayOrder?: number;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  status: "DRAFT" | "PUBLISHED";
  media: MediaItem[];
}

const emptyForm: EventFormData = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  imageUrl: "",
  status: "DRAFT",
  media: [],
};

export default function EventFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const eventId = isNew ? null : Number(params.id);

  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);

        const event = json.data;
        setForm({
          title: event.title || "",
          description: event.description || "",
          date: event.date ? event.date.slice(0, 10) : "",
          time: event.time || "",
          location: event.location || "",
          imageUrl: event.imageUrl || "",
          status: event.status || "DRAFT",
          media: event.media || [],
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        date: form.date || new Date().toISOString().slice(0, 10),
      };

      const url = isNew ? "/api/events" : `/api/events/${eventId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const savedId = json.data.id;

      if (form.media.length > 0) {
        const existingMediaIds = new Set(
          form.media.filter((m) => m.id).map((m) => m.id),
        );

        const currentRes = await fetch(`/api/events/${savedId}/media`);
        const currentJson = await currentRes.json();
        const currentMedia: MediaItem[] = currentJson.data || [];

        for (const item of currentMedia) {
          if (item.id && !existingMediaIds.has(item.id)) {
            await fetch(`/api/events/${savedId}/media/${item.id}`, {
              method: "DELETE",
            });
          }
        }

        for (const item of form.media) {
          if (item.id) {
            await fetch(`/api/events/${savedId}/media/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: item.imageUrl,
                alt: item.alt || null,
                caption: item.caption || null,
                displayOrder: item.displayOrder || 0,
              }),
            });
          } else {
            await fetch(`/api/events/${savedId}/media`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: item.imageUrl,
                alt: item.alt || null,
                caption: item.caption || null,
                displayOrder: item.displayOrder || 0,
              }),
            });
          }
        }
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/events")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl">
            {isNew ? "New Event" : "Edit Event"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNew ? "Create a new event" : `Event #${eventId}`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                  placeholder="Event title"
                />
              </div>

              <div className="space-y-1.5">
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => updateField("imageUrl", url)}
                  label="Cover Image"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Event location"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as "DRAFT" | "PUBLISHED",
                    )
                  }
                  className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={form.description}
              onChange={(val) => updateField("description", val)}
              placeholder="Write event description..."
              minHeight="250px"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Media Gallery
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {form.media.length} image{form.media.length !== 1 && "s"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MediaGallery
              items={form.media}
              onChange={(items) => updateField("media", items)}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving || !form.title}>
            <Save className="size-4" />
            {saving ? "Saving..." : isNew ? "Create Event" : "Save Changes"}
          </Button>
          <Link
            href="/admin/events"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
