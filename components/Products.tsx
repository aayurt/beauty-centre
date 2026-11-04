"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  price: string;
  imageUrl: string | null;
  isActive: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/products?activeOnly=true", {
          cache: "no-store",
        });
        const json = await res.json();
        if (!cancelled) {
          setProducts(json.data ?? []);
        }
      } catch {
        // silently fall back to empty list
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return null;
  }

  const active = products.filter((p) => p.isActive);
  if (active.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Products we use</h2>
          <p className="text-muted-foreground">
            Professional-grade products trusted by our stylists.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {active.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-shadow hover:shadow-sm overflow-hidden"
            >
              {product.imageUrl ? (
                <div className="h-32 mb-4 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    priority={product.id <= 3}
                  />
                </div>
              ) : (
                <div className="h-32 mb-4 flex items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <span className="text-xs">No image</span>
                </div>
              )}
              <div>
                <h3 className="font-medium font-serif">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.brand}
                  </p>
                )}
                {product.price && (
                  <p className="mt-1 text-sm font-medium">
                    {product.price}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
