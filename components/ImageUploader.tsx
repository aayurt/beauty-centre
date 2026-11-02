"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value || "");

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Upload failed");
        if (json.data?.url) {
          onChange(json.data.url);
        }
      } catch (err: any) {
        alert(err?.message || "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleUrlSubmit() {
    onChange(urlValue);
    setShowUrlInput(false);
  }

  function handleRemove() {
    onChange("");
    setUrlValue("");
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="group relative overflow-hidden rounded-lg bg-muted">
          <img
            src={value}
            alt="Preview"
            className="h-40 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E";
            }}
          />
          {/* Mobile-accessible action toolbar / hover overlay on desktop */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full border border-black/10 bg-background/90 p-1 shadow-md backdrop-blur-md transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 dark:border-white/15 dark:bg-neutral-900/90">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-muted"
              onClick={() => {
                setShowUrlInput(true);
                setUrlValue(value);
              }}
              title="Change URL"
            >
              <Link className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full hover:bg-muted"
              onClick={() => inputRef.current?.click()}
              title="Upload new"
            >
              <Upload className="size-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-8 rounded-full"
              onClick={handleRemove}
              title="Remove"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : showUrlInput ? (
        <div className="flex items-center gap-2">
          <Input
            type="url"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://example.com/image.jpg"
            autoFocus
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlValue}
          >
            Set
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowUrlInput(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors outline-none will-change-transform ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-input hover:border-primary hover:bg-muted"
          } focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="size-6 animate-spin rounded-full border-b-2 border-primary" />
              <span className="text-sm text-muted-foreground">
                Uploading...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="size-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  PNG, JPG, WebP, GIF, AVIF up to 5MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUrlInput(true);
                }}
                className="text-xs text-muted-foreground underline transition-colors hover:text-primary focus-visible:text-primary outline-none rounded"
              >
                Or paste an image URL
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
