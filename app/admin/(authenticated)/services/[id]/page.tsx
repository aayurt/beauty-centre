"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceFormData {
  title: string;
  category: string;
  price: string;
  duration: string;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "hair", label: "Hair Care" },
  { value: "facials", label: "Facials & Skin" },
  { value: "nails", label: "Nails & Lash" },
  { value: "massage", label: "Massage & Spa" },
  { value: "bridal", label: "Bridal Packages" },
];

const emptyForm: ServiceFormData = {
  title: "",
  category: "hair",
  price: "",
  duration: "",
  displayOrder: 0,
  isActive: true,
};

export default function ServiceFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const serviceId = isNew ? null : Number(params.id);

  const [form, setForm] = useState<ServiceFormData>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!serviceId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) {
          const s = json.data;
          setForm({
            title: s.title || "",
            category: s.category || "hair",
            price: s.price || "",
            duration: s.duration || "",
            displayOrder: s.displayOrder ?? 0,
            isActive: s.isActive ?? true,
          });
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/services" : `/api/services/${serviceId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof ServiceFormData>(
    field: K,
    value: ServiceFormData[K],
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
          onClick={() => router.push("/admin/services")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl">
            {isNew ? "Add Service" : "Edit Service"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNew ? "Add a new service" : `Service #${serviceId}`}
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
                  Name / Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  required
                  placeholder="e.g. Haircut & Blowout"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    updateField("category", value ?? "hair")
                  }
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="e.g. NPR 1,200"
                />
                <p className="text-xs text-muted-foreground">
                  Hidden on the public site for now.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="text"
                  value={form.duration}
                  onChange={(e) => updateField("duration", e.target.value)}
                  placeholder="e.g. 45 mins"
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
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="size-4 rounded border-input text-primary focus:ring-ring"
                />
                <Label htmlFor="isActive" className="font-medium">
                  Enabled
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving || !form.title}>
            <Save className="size-4" />
            {saving ? "Saving..." : isNew ? "Add Service" : "Save Changes"}
          </Button>
          <Link
            href="/admin/services"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
