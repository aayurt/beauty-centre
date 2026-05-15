"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    rating: 5,
    text: "The most relaxing facial I've ever had! My skin has never looked better. The team at K & S truly knows how to pamper their clients.",
    service: "Facial Treatment",
  },
  {
    name: "Emily Carter",
    rating: 5,
    text: "I've been coming here for my hair for over a year now. Katherine always understands exactly what I want and delivers beyond my expectations.",
    service: "Hair Styling",
  },
  {
    name: "Jessica Brown",
    rating: 5,
    text: "Maya's massage therapy is incredible. I left feeling completely renewed. This place is my sanctuary from the stress of daily life.",
    service: "Deep Tissue Massage",
  },
  {
    name: "Amanda Lee",
    rating: 5,
    text: "Emma transformed my hair with the most beautiful balayage. I get compliments everywhere I go. Thank you, K & S Beauty Centre!",
    service: "Hair Colour",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-primary-pink-light text-sage-green rounded-full text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            What Our Clients{" "}
            <span className="text-sage-green">Say About Us</span>
          </h2>
        </AnimatedSection>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatedSection direction="scale">
            <div className="bg-primary-pink-light rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-sage-green fill-sage-green"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg sm:text-xl md:text-2xl text-text-dark leading-relaxed font-serif italic mb-6 sm:mb-8">
                &ldquo;{testimonials[activeIndex].text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-text-dark text-lg">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-sage-green text-sm">
                    {testimonials[activeIndex].service}
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={prev}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-sage-green hover:text-white active:bg-sage-green/80 transition-colors shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={next}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-sage-green hover:text-white active:bg-sage-green/80 transition-colors shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 outline-none ${
                  index === activeIndex
                    ? "bg-sage-green w-8"
                    : "bg-gray-300 hover:bg-gray-400 active:bg-gray-500"
                } focus-visible:ring-3 focus-visible:ring-ring/50`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}