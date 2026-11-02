"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import {
  Plus,
  Star,
  Trash2,
  Edit2,
  Check,
  X,
  Quote,
  Download,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  service: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "active" | "hidden">("all");

  // Single Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Bulk Import Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importInput, setImportInput] = useState("");
  const [importServiceDefault, setImportServiceDefault] = useState("");
  const [importAsActive, setImportAsActive] = useState(true);
  const [importing, setImporting] = useState(false);

  const loadReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews?activeOnly=false", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to load reviews");
      }
      setReviews(json.data ?? []);
      setError("");
    } catch (err: any) {
      setError(err?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  function openCreateModal() {
    setEditingReview(null);
    setName("");
    setRating(5);
    setText("");
    setService("");
    setIsActive(true);
    setShowModal(true);
  }

  function openEditModal(review: Review) {
    setEditingReview(review);
    setName(review.name);
    setRating(review.rating);
    setText(review.text);
    setService(review.service || "");
    setIsActive(review.isActive);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingReview) {
        const res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            rating,
            text,
            service: service.trim() || null,
            isActive,
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Update failed");
      } else {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            rating,
            text,
            service: service.trim() || null,
            displayOrder: reviews.length,
            isActive,
          }),
        });
        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || "Creation failed");
      }
      setShowModal(false);
      await loadReviews();
    } catch (err: any) {
      alert(err?.message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  }

  // Parse text or JSON into reviews
  function parseImportText(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    // Try JSON array first
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            name: item.name || item.author_name || item.author || "Google Reviewer",
            rating: typeof item.rating === "number" ? item.rating : 5,
            text: item.text || item.review || item.comment || "",
            service: item.service || importServiceDefault.trim() || null,
            isActive: importAsActive,
          })).filter((r: any) => r.text && r.text.length > 0);
        }
      } catch {}
    }

    // Double-Newline Block format:
    // Reviewer Name (or Name - 5 stars)
    // Review text
    const blocks = trimmed.split(/\n\s*\n+/);
    const results: Array<{
      name: string;
      rating: number;
      text: string;
      service: string | null;
      isActive: boolean;
    }> = [];

    for (const block of blocks) {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) continue;

      let reviewerName = "Google Reviewer";
      let reviewRating = 5;
      let reviewBody = "";

      if (lines.length === 1) {
        reviewBody = lines[0];
      } else {
        const header = lines[0];
        const starMatch = header.match(/([1-5])\s*(?:stars?|\/5|★)/i);
        if (starMatch) {
          reviewRating = parseInt(starMatch[1], 10);
        }
        reviewerName = header.replace(/[-–(].*$/, "").replace(/★+/g, "").trim() || "Google Reviewer";
        reviewBody = lines.slice(1).join(" ");
      }

      if (reviewBody) {
        results.push({
          name: reviewerName,
          rating: reviewRating,
          text: reviewBody,
          service: importServiceDefault.trim() || null,
          isActive: importAsActive,
        });
      }
    }

    return results;
  }

  async function handleBulkImport(e: FormEvent) {
    e.preventDefault();
    const parsed = parseImportText(importInput);
    if (parsed.length === 0) {
      alert("No valid reviews found in input. Please paste either text blocks or JSON.");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/reviews/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: parsed }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Batch import failed");

      alert(`Successfully imported ${json.data?.count || parsed.length} reviews!`);
      setShowImportModal(false);
      setImportInput("");
      await loadReviews();
    } catch (err: any) {
      alert(err?.message || "Failed to import reviews");
    } finally {
      setImporting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to delete");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete review");
    }
  }

  async function handleToggleActive(review: Review) {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !review.isActive }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error);
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isActive: !r.isActive } : r))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update review status");
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (filterMode === "active") return r.isActive;
    if (filterMode === "hidden") return !r.isActive;
    return true;
  });

  const activeCount = reviews.filter((r) => r.isActive).length;
  const hiddenCount = reviews.filter((r) => !r.isActive).length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Google &amp; Client Reviews
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Import, curate, and toggle visibility for reviews appearing on your homepage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <Download className="size-4" />
            Import from Google
          </Button>
          <Button onClick={openCreateModal} className="gap-2 rounded-xl">
            <Plus className="size-4" />
            Add Review
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
          <Filter className="size-3" />
          Filter:
        </span>
        <Button
          variant={filterMode === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilterMode("all")}
          className="rounded-full text-xs h-7 px-3"
        >
          All ({reviews.length})
        </Button>
        <Button
          variant={filterMode === "active" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilterMode("active")}
          className="rounded-full text-xs h-7 px-3 gap-1.5"
        >
          <Eye className="size-3 text-emerald-500" />
          Live on Homepage ({activeCount})
        </Button>
        <Button
          variant={filterMode === "hidden" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilterMode("hidden")}
          className="rounded-full text-xs h-7 px-3 gap-1.5"
        >
          <EyeOff className="size-3 text-neutral-400" />
          Hidden / Unwanted ({hiddenCount})
        </Button>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Quote className="size-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No reviews matching filter</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
            {filterMode === "hidden"
              ? "None of your reviews are hidden right now. All active reviews are displaying on the homepage."
              : "Import or add reviews from your Google Business Profile to show them here."}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setShowImportModal(true)} variant="outline" className="gap-2 rounded-xl">
              <Download className="size-4" />
              Import Google Reviews
            </Button>
            <Button onClick={openCreateModal} className="gap-2 rounded-xl">
              <Plus className="size-4" />
              Add Manually
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200",
                r.isActive
                  ? "border-border bg-card hover:shadow-md"
                  : "border-border/40 bg-muted/30 opacity-75 grayscale-[20%]"
              )}
            >
              <div>
                {/* Top Bar with rating & mobile-accessible action pills */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < r.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted/40"
                        )}
                      />
                    ))}
                    <span className="text-xs font-semibold ml-1.5 text-foreground">
                      {r.rating}.0
                    </span>
                  </div>

                  {/* Floating Action Pill */}
                  <div className="flex items-center gap-1 bg-background/85 backdrop-blur-md p-1 rounded-full border border-border/80 shadow-sm">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(r)}
                      className={cn(
                        "p-1 rounded-full transition-colors active:scale-90",
                        r.isActive
                          ? "text-emerald-600 hover:bg-emerald-500/10"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                      title={r.isActive ? "Hide from homepage" : "Show on homepage"}
                    >
                      {r.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(r)}
                      className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors active:scale-90"
                      title="Edit review"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="p-1 rounded-full text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-90"
                      title="Delete review"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Review Text */}
                <blockquote className="my-4 text-sm text-foreground/90 font-serif leading-relaxed line-clamp-4">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
              </div>

              {/* Reviewer Meta & Status */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{r.name}</h4>
                  {r.service && (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      {r.service}
                    </p>
                  )}
                </div>

                <Badge
                  variant={r.isActive ? "default" : "secondary"}
                  onClick={() => handleToggleActive(r)}
                  className="cursor-pointer text-[10px] uppercase font-bold tracking-wider select-none"
                >
                  {r.isActive ? (
                    <span className="flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  ) : (
                    "Hidden"
                  )}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Bulk Import */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Download className="size-4" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold">Import Google Reviews</h2>
                  <p className="text-xs text-muted-foreground">
                    Batch-import reviews from Google Maps in one click.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Paste Reviews (Text blocks or JSON) *
                </label>
                <p className="text-xs text-muted-foreground mb-2">
                  You can copy multiple reviews directly from Google Maps and paste them below, separated by blank lines. E.g.:
                  <br />
                  <code className="text-primary font-mono text-[11px] block mt-1 bg-muted/60 p-2 rounded-lg">
                    Rohan Shrestha - 5 stars<br />
                    Amazing haircut and friendly staff! Highly recommended.<br />
                    <br />
                    Pooja KC - 5 stars<br />
                    Best facial treatment in Kathmandu.
                  </code>
                </p>
                <textarea
                  required
                  rows={8}
                  value={importInput}
                  onChange={(e) => setImportInput(e.target.value)}
                  placeholder="Paste your copied Google reviews here..."
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Default Service Tag (Optional)
                  </label>
                  <Input
                    value={importServiceDefault}
                    onChange={(e) => setImportServiceDefault(e.target.value)}
                    placeholder="e.g. Salon Experience"
                    className="rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="import-active"
                    checked={importAsActive}
                    onChange={(e) => setImportAsActive(e.target.checked)}
                    className="size-4 rounded accent-primary cursor-pointer"
                  />
                  <label htmlFor="import-active" className="text-xs font-medium cursor-pointer">
                    Publish to Homepage immediately
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowImportModal(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={importing || !importInput.trim()} className="rounded-xl gap-2">
                  <Check className="size-4" />
                  {importing ? "Importing..." : "Parse & Import Reviews"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog for Single Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h2 className="font-serif text-lg font-bold">
                {editingReview ? "Edit Review" : "Add Review"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Client / Reviewer Name *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Mitchell"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Rating (Stars)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value, 10))}
                    className="w-full h-9 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Service Tag (Optional)
                  </label>
                  <Input
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. Hair Spa &amp; Colour"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the review feedback here..."
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active-check"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="active-check" className="text-xs font-medium cursor-pointer">
                  Display on Homepage Testimonials
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="rounded-xl gap-2">
                  <Check className="size-4" />
                  {submitting ? "Saving..." : editingReview ? "Update Review" : "Save Review"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
