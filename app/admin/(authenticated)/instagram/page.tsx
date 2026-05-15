"use client";

import { useEffect, useState } from "react";
import { ExternalLink, GripVertical, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface InstagramPost {
  id: number;
  postUrl: string;
  caption: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/instagram-posts");
        const json = await res.json();
        if (!cancelled) {
          if (json.error) throw new Error(json.error);
          setPosts(json.data);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch("/api/instagram-posts");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setPosts(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/instagram-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postUrl, caption: caption || undefined }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setPostUrl("");
      setCaption("");
      setShowForm(false);
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add post");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/instagram-posts/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.error) {
      setError(json.error);
      return;
    }
    await loadPosts();
  }

  async function handleReorder(id: number, direction: "up" | "down") {
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= posts.length) return;

    const current = posts[idx];
    const swap = posts[swapIdx];

    await Promise.all([
      fetch(`/api/instagram-posts/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: swap.displayOrder }),
      }),
      fetch(`/api/instagram-posts/${swap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayOrder: current.displayOrder }),
      }),
    ]);

    await loadPosts();
  }

  function extractShortcode(url: string) {
    const match = url.match(/instagram\.com\/p\/([^\/?#]+)/);
    return match ? match[1] : null;
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Instagram Feed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {posts.length} post{posts.length !== 1 && "s"}
          </p>
        </div>
        <Button
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <>
              <X className="size-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="size-4" />
              Add Post
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setError("")}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 space-y-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
        >
          <div className="space-y-1.5">
            <Label htmlFor="postUrl">Instagram Post URL</Label>
            <Input
              id="postUrl"
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="A brief note for reference"
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add to Feed"}
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {posts.length === 0 ? (
          <Card className="p-12 text-center">
            <ExternalLink className="mx-auto mb-4 size-12 text-muted-foreground/40" />
            <h2 className="mb-2 text-lg font-medium">
              No Instagram posts yet
            </h2>
            <p className="text-sm text-muted-foreground">
              Add posts by pasting their Instagram URLs above.
            </p>
          </Card>
        ) : (
          posts.map((post, index) => {
            const shortcode = extractShortcode(post.postUrl);
            return (
              <div
                key={post.id}
                className="flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-col gap-1 text-muted-foreground/30">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleReorder(post.id, "up")}
                    disabled={index === 0}
                  >
                    <GripVertical className="size-4 rotate-90" />
                  </Button>
                </div>

                {shortcode && (
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={`https://instagram.com/p/${shortcode}/media?size=t`}
                      alt=""
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://instagram.com/p/${shortcode}/media?size=m`;
                      }}
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 truncate text-sm text-primary hover:underline"
                  >
                    {post.postUrl}
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                  {post.caption && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {post.caption}
                    </p>
                  )}
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    post.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {post.isActive ? "Active" : "Inactive"}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                  className="hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Posts are displayed on the homepage in this order. Instagram&apos;s
        embed script renders each post as an interactive card.
      </p>
    </div>
  );
}
