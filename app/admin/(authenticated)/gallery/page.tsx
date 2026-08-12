"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Image, Trash2, Upload, X, Pencil, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  span: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminGalleryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [editingAlt, setEditingAlt] = useState<Record<number, string>>({});
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});

  async function loadItems() {
    const res = await fetch("/api/gallery?activeOnly=false");
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    setItems(json.data);
    const alts: Record<number, string> = {};
    json.data.forEach((item: GalleryItem) => {
      alts[item.id] = item.alt;
    });
    setEditingAlt(alts);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await loadItems();
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load gallery",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.data?.url) throw new Error("Upload failed");

      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: uploadJson.data.url,
          alt: "",
          displayOrder: items.length,
        }),
      });

      await loadItems();
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  async function handleAddUrl() {
    if (!urlInput.trim()) return;
    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: urlInput.trim(),
          alt: "",
          displayOrder: items.length,
        }),
      });
      setUrlInput("");
      setShowUrlForm(false);
      await loadItems();
    } catch {
      alert("Failed to add image");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Failed to delete");
    }
  }

  async function handleToggleActive(item: GalleryItem) {
    try {
      await fetch(`/api/gallery/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, isActive: !i.isActive } : i,
        ),
      );
    } catch {
      alert("Failed to update");
    }
  }

  async function handleAltSave(id: number) {
    try {
      await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: editingAlt[id] || "" }),
      });
    } catch {
      alert("Failed to save alt text");
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
          <h1 className="font-serif text-2xl">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} image{items.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="size-4 animate-spin rounded-full border-b-2 border-current" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUrlForm(!showUrlForm)}
          >
            <Plus className="size-4" />
            URL
          </Button>
        </div>
      </div>

      {showUrlForm && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <Input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddUrl();
            }}
          />
          <Button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowUrlForm(false);
              setUrlInput("");
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Image className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">No images yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Upload your first image to build the gallery.
          </p>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" />
            Upload Image
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
            >
              <div className="relative aspect-square bg-muted">
                <img
                  src={item.src}
                  alt={item.alt || "Gallery"}
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <div className="flex items-center gap-1">
                  <Input
                    type="text"
                    value={editingAlt[item.id] ?? ""}
                    readOnly={!editMode[item.id]}
                    onChange={(e) =>
                      setEditingAlt((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    title="Alt text"
                    className="h-6 flex-1 px-1.5 py-0.5 text-xs"
                  />
                  <Button
                    type="button"
                    size="icon-xs"
                    variant={editMode[item.id] ? "secondary" : "ghost"}
                    onClick={() =>
                      setEditMode((prev) => ({
                        ...prev,
                        [item.id]: !prev[item.id],
                      }))
                    }
                    title={editMode[item.id] ? "Stop editing" : "Edit alt text"}
                  >
                    <Pencil className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => {
                      handleAltSave(item.id);
                      setEditMode((prev) => ({ ...prev, [item.id]: false }));
                    }}
                    disabled={!editMode[item.id] || !(editingAlt[item.id] ?? "").trim()}
                    title="Save alt text"
                  >
                    <Save className="size-3" />
                  </Button>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <p
                    className="truncate text-[10px] text-muted-foreground"
                    title={item.src}
                  >
                    {item.src.split("/").pop()}
                  </p>
                  <Button
                    type="button"
                    size="xs"
                    variant={item.isActive ? "secondary" : "outline"}
                    onClick={() => handleToggleActive(item)}
                    className="gap-1 px-2 text-[10px]"
                  >
                    {item.isActive ? (
                      <Eye className="size-3" />
                    ) : (
                      <EyeOff className="size-3" />
                    )}
                    {item.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}
