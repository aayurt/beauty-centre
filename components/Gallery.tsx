"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import Image from "next/image";
import { X } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary-pink-light text-sage-green rounded-full text-sm font-medium mb-6">
            Our Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            A Glimpse Into{" "}
            <span className="text-sage-green">Our World</span>
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Step inside our sanctuary and experience the ambiance that makes K & S Beauty Centre a destination for relaxation and transformation.
          </p>
        </AnimatedSection>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <AnimatedSection
              key={index}
              direction="scale"
              delay={index * 0.1}
              className={`${image.span} relative group cursor-pointer overflow-hidden rounded-xl`}
              onClick={() => setSelectedImage(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  View
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary-pink transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <Image
            src={selectedImage}
            alt="Gallery image"
            width={1200}
            height={800}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </section>
  );
}