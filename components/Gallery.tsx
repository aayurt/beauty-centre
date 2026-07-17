"use client";

import { useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    alt: "Elegant salon interior",
    span: "md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80",
    alt: "Hair styling session",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    alt: "Facial treatment room",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    alt: "Massage therapy room",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
    alt: "Hair colour treatment",
    span: "md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    alt: "Beauty products display",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
    alt: "Reception area",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    alt: "Relaxation lounge",
    span: "",
  },
];

export default function Gallery() {
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      const isLightboxOpen = /^#lightbox-\d+$/.test(hash);
      document.body.style.overflow = isLightboxOpen ? "hidden" : "";
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-blush-light dark:bg-neutral-700 text-crimson-primary rounded-full text-sm font-medium mb-6">
            Our Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            A Glimpse Into{" "}
            <span className="text-crimson-primary">Our World</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Step inside our sanctuary and experience the ambiance that makes K
            &amp; S Beauty Centre a destination for relaxation and
            transformation.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[220px]">
          {galleryImages.map((image, index) => (
            <AnimatedSection
              key={index}
              direction="scale"
              delay={index * 0.1}
              className={`${image.span} relative group cursor-pointer overflow-hidden rounded-xl`}
            >
              <a
                href={`#lightbox-${index}`}
                className="block relative w-full h-full"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium translate-y-2 group-hover:translate-y-0 inline-block">
                    View
                  </span>
                </div>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* CSS-only lightboxes */}
      {galleryImages.map((image, index) => (
        <div key={index} id={`lightbox-${index}`} className="lightbox">
          <a href="#gallery" className="lightbox-backdrop" aria-label="Close lightbox" />
          <a
            href="#gallery"
            className="lightbox-close"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </a>

          {index > 0 && (
            <a
              href={`#lightbox-${index - 1}`}
              className="lightbox-nav prev"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </a>
          )}

          {index < galleryImages.length - 1 && (
            <a
              href={`#lightbox-${index + 1}`}
              className="lightbox-nav next"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </a>
          )}

          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={800}
            className="lightbox-content"
            unoptimized
          />

          <span className="lightbox-counter">
            {index + 1} / {galleryImages.length}
          </span>
        </div>
      ))}
    </section>
  );
}
