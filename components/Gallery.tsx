"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedSection from "./animations/AnimatedSection";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
  span: string;
}

const FILTERS = ["All", "Hair", "Makeup", "Nails"] as const;
type Filter = (typeof FILTERS)[number];

function categoryOf(alt: string): Filter {
  const hay = alt.toLowerCase();
  if (/(nail|manicure|pedicure|lash)/.test(hay)) return "Nails";
  if (/(makeup|bridal|glam)/.test(hay)) return "Makeup";
  if (/(hair|cut|colour|style|blow)/.test(hay)) return "Hair";
  return "All";
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/gallery?activeOnly=true")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) setImages(json.data);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? images
        : images.filter((img) => categoryOf(img.alt) === filter),
    [images, filter],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") setLightbox((p) => (p === null ? p : (p + filtered.length - 1) % filtered.length));
      if (e.key === "ArrowRight") setLightbox((p) => (p === null ? p : (p + 1) % filtered.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, filtered.length]);

  return (
    <section
      id="gallery"
      className="py-24 md:py-32 bg-white dark:bg-neutral-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="inline-block px-4 py-2 bg-rose-light dark:bg-neutral-700 text-amber-primary rounded-full text-sm font-medium mb-6">
            Our Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            A Glimpse Into{" "}
            <span className="text-amber-primary">Our World</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Step inside our sanctuary and experience the ambiance that makes K
            &amp; S Beauty Centre a destination for relaxation and
            transformation.
          </p>
        </AnimatedSection>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setLightbox(null);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                filter === f
                  ? "bg-amber-primary text-white shadow-md shadow-amber-primary/25"
                  : "bg-rose-light dark:bg-neutral-800 text-muted-foreground hover:bg-amber-primary/10 hover:text-amber-primary",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No images in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[220px]">
            <AnimatePresence mode="popLayout">
              {filtered.map((image, index) => (
                <motion.button
                  key={image.src + index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => setLightbox(index)}
                  className={cn(
                    `${image.span} relative group cursor-pointer overflow-hidden rounded-xl`,
                  )}
                  aria-label={`View ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized={image.src.startsWith("/uploads/")}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium translate-y-2 group-hover:translate-y-0 inline-block">
                      View
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
              onClick={() => setLightbox(null)}
            >
              <X className="size-6" />
            </button>

            {lightbox > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((p) => (p === null ? p : (p + filtered.length - 1) % filtered.length));
                }}
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            {lightbox < filtered.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((p) => (p === null ? p : (p + 1) % filtered.length));
                }}
              >
                <ChevronRight className="size-6" />
              </button>
            )}

            <motion.figure
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1200}
                height={800}
                unoptimized={filtered[lightbox].src.startsWith("/uploads/")}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
              <figcaption className="mt-3 text-center text-sm text-white/70">
                {filtered[lightbox].alt} — {lightbox + 1} / {filtered.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
