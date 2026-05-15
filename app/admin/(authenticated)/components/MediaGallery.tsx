"use client";

import { useRef, useState } from "react";
import { Image, X, GripVertical, Link, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaItem {
  id?: number;
  imageUrl: string;
  alt?: string;
  caption?: string;
  displayOrder?: number;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  readOnly?: boolean;
}

export default function MediaGallery({
  items,
  onChange,
  readOnly = false,
}: MediaGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const addMedia = () => {
    if (!urlInput.trim()) return;
    onChange([
      ...items,
      {
        imageUrl: urlInput.trim(),
        alt: "",
        caption: "",
        displayOrder: items.length,
      },
    ]);
    setUrlInput("");
    setShowAddForm(false);
  };

  const removeMedia = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateMedia = (
    index: number,
    field: keyof MediaItem,
    value: string | number,
  ) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.data?.url) {
        onChange([
          ...items,
          {
            imageUrl: json.data.url,
            alt: "",
            caption: "",
            displayOrder: items.length,
          },
        ]);
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated.map((item, i) => ({ ...item, displayOrder: i })));
  };

  if (readOnly && items.length === 0) {
    return (
      <div className="text-sm italic text-muted-foreground">
        No media attached
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              <div className="relative aspect-square bg-muted">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.alt || "Gallery image"}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Image className="size-8 text-muted-foreground" />
                  </div>
                )}
                {!readOnly && (
                  <>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      title="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                    <button
                      type="button"
                      className="absolute left-1 top-1 cursor-grab rounded-full bg-background/80 p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      title="Drag to reorder"
                    >
                      <GripVertical className="size-3" />
                    </button>
                  </>
                )}
              </div>
              {!readOnly && (
                <div className="space-y-1 p-2">
                  <Input
                    type="text"
                    value={item.alt || ""}
                    onChange={(e) => updateMedia(index, "alt", e.target.value)}
                    placeholder="Alt text"
                    className="h-6 px-1.5 py-0.5 text-xs"
                  />
                  <Input
                    type="text"
                    value={item.caption || ""}
                    onChange={(e) =>
                      updateMedia(index, "caption", e.target.value)
                    }
                    placeholder="Caption"
                    className="h-6 px-1.5 py-0.5 text-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {uploading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-b-2 border-current" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Upload image
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Link className="size-4" />
              URL
            </button>
          </div>

          {showAddForm && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") addMedia();
                }}
              />
              <Button
                type="button"
                onClick={addMedia}
                disabled={!urlInput.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setUrlInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
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
