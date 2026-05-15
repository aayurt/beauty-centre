"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";

interface StaffFormData {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const emptyForm: StaffFormData = {
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function StaffFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const staffId = isNew ? null : Number(params.id);

  const [form, setForm] = useState<StaffFormData>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!staffId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/staff/${staffId}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) {
          const s = json.data;
          setForm({
            name: s.name || "",
            role: s.role || "",
            bio: s.bio || "",
            imageUrl: s.imageUrl || "",
            displayOrder: s.displayOrder ?? 0,
            isActive: s.isActive ?? true,
          });
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load staff");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [staffId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/staff" : `/api/staff/${staffId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      router.push("/admin/staff");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save staff");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof StaffFormData>(
    field: K,
    value: StaffFormData[K],
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
          onClick={() => router.push("/admin/staff")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl">
            {isNew ? "Add Staff Member" : "Edit Staff Member"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNew ? "Add a new team member" : `Staff #${staffId}`}
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
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Role / Title</Label>
                <Input
                  id="role"
                  type="text"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="e.g. Senior Stylist"
                />
              </div>

              <div className="space-y-1.5">
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => updateField("imageUrl", url)}
                  label="Photo"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    updateField("displayOrder", parseInt(e.target.value) || 0)
                  }
                  min="0"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    updateField("isActive", e.target.checked)
                  }
                  className="size-4 rounded border-input text-primary focus:ring-ring"
                />
                <Label htmlFor="isActive" className="font-medium">
                  Active
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Write a short biography..."
              rows={5}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-y dark:bg-input/30"
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving || !form.name}>
            <Save className="size-4" />
            {saving ? "Saving..." : isNew ? "Add Member" : "Save Changes"}
          </Button>
          <Link
            href="/admin/staff"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
