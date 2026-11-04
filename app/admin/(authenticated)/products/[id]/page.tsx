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
import ImageUploader from "@/components/ImageUploader";

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORIES = [
  { value: "hair", label: "Hair Care" },
  { value: "skincare", label: "Skincare & Facials" },
  { value: "waxing", label: "Waxing" },
  { value: "nails", label: "Nails & Spa" },
  { value: "makeup", label: "Makeup" },
  { value: "tools", label: "Tools & Accessories" },
  { value: "other", label: "Other" },
];

const emptyForm: ProductFormData = {
  name: "",
  brand: "",
  category: "hair",
  description: "",
  price: "",
  imageUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function AdminProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";
  const productId = isNew ? null : Number(params.id);

  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        if (!cancelled) {
          const p = json.data;
          setForm({
            name: p.name || "",
            brand: p.brand || "",
            category: p.category || "hair",
            description: p.description || "",
            price: p.price || "",
            imageUrl: p.imageUrl || "",
            displayOrder: p.displayOrder ?? 0,
            isActive: p.isActive ?? true,
          });
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isNew ? "/api/products" : `/api/products/${productId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
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
          onClick={() => router.push("/admin/products")}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl">
            {isNew ? "Add Product" : "Edit Product"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isNew
              ? "Add a new product to the 'Products we use' list"
              : `Product #${productId}`}
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
                  placeholder="e.g. L'Oreal Professionnel"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  type="text"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. L'Oreal"
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
                <Label htmlFor="price">Price (optional)</Label>
                <Input
                  id="price"
                  type="text"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="e.g. NPR 1,200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Short product description"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="imageUrl">Product Image</Label>
                <ImageUploader
                  value={form.imageUrl}
                  onChange={(url) => updateField("imageUrl", url)}
                  label="Upload or paste product image"
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
          <Button type="submit" disabled={saving || !form.name}>
            <Save className="size-4" />
            {saving ? "Saving..." : isNew ? "Add Product" : "Save Changes"}
          </Button>
          <Link
            href="/admin/products"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
