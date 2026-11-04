"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Scissors, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  price: string;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  hair: "Hair Care",
  skincare: "Skincare & Facials",
  waxing: "Waxing",
  nails: "Nails & Spa",
  makeup: "Makeup",
  tools: "Tools & Accessories",
  other: "Other",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?activeOnly=false", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to load products");
      }
      setProducts(json.data ?? []);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadProducts();
    })();
  }, [loadProducts]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  }

  async function handleToggleActive(id: number, isActive: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch {
      alert("Failed to update product status");
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
          <h1 className="font-serif text-2xl">Products we use</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 && "s"}
          </p>
        </div>
        <Button onClick={() => (window.location.href = "/admin/products/new")}>
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Scissors className="size-8 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-lg font-medium">No products yet</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Add your first product to build the &quot;Products we use&quot; list.
          </p>
          <Button
            onClick={() => (window.location.href = "/admin/products/new")}
          >
            <Plus className="size-4" />
            Add Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm"
            >
              <div className="relative h-48 bg-muted overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-muted-foreground">
                    <Scissors className="size-8" />
                  </div>
                )}
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="truncate text-base font-medium">
                    {product.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {product.brand || "—"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </p>
                {product.price && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Price: {product.price}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">
                    Order: {product.displayOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        (window.location.href = `/admin/products/${product.id}`)
                      }
                      title="Edit product"
                    >
                      <Scissors className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      title="Delete product"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(product.id, product.isActive)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors border border-transparent ${product.isActive ? "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20" : "bg-muted/50 text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {product.isActive ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
