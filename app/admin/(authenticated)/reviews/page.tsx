"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import { Plus, Star, Trash2, Edit2, Check, X, Quote } from "lucide-react";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    setShowAddModal(true);
  }

  function openEditModal(review: Review) {
    setEditingReview(review);
    setName(review.name);
    setRating(review.rating);
    setText(review.text);
    setService(review.service || "");
    setIsActive(review.isActive);
    setShowAddModal(true);
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
      setShowAddModal(false);
      await loadReviews();
    } catch (err: any) {
      alert(err?.message || "Failed to save review");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Client &amp; Google Reviews
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Add, curate, and feature reviews from Google Maps and happy clients on your homepage.
          </p>
        </div>
        <Button onClick={openCreateModal} className="gap-2 rounded-xl">
          <Plus className="size-4" />
          Add Review
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <Quote className="size-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No reviews yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
            Copy 5-star reviews from your Google Business profile to display on your salon homepage.
          </p>
          <Button onClick={openCreateModal} variant="outline" className="gap-2 rounded-xl">
            <Plus className="size-4" />
            Add First Review
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
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
                <div className="flex items-center gap-1 bg-muted/80 backdrop-blur-md p-1 rounded-full border border-border/60">
                  <button
                    type="button"
                    onClick={() => openEditModal(r)}
                    className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors active:scale-90"
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

              {/* Reviewer Meta & Visibility Toggle */}
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
                  variant={r.isActive ? "default" : "outline"}
                  onClick={() => handleToggleActive(r)}
                  className="cursor-pointer text-[10px] uppercase font-bold tracking-wider"
                >
                  {r.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Add/Edit Review */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <h2 className="font-serif text-lg font-bold">
                {editingReview ? "Edit Review" : "Add Review from Google"}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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
                  onClick={() => setShowAddModal(false)}
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
