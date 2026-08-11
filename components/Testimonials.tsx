"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "./animations/AnimatedSection";
import { Star } from "lucide-react";
import { Marquee, MarqueeItem } from "@/components/effects/Marquee";
import { cn } from "@/lib/utils";

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  service: string | null;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    rating: 5,
    text: "The most relaxing facial I've ever had! My skin has never looked better. The team at K & S truly knows how to pamper their clients.",
    service: "Facial Treatment",
  },
  {
    id: 2,
    name: "Emily Carter",
    rating: 5,
    text: "I've been coming here for my hair for over a year now. They always understand exactly what I want and deliver beyond my expectations.",
    service: "Hair Styling",
  },
  {
    id: 3,
    name: "Jessica Brown",
    rating: 5,
    text: "The massage therapy is incredible. I left feeling completely renewed. This place is my sanctuary from the stress of daily life.",
    service: "Deep Tissue Massage",
  },
  {
    id: 4,
    name: "Amanda Lee",
    rating: 5,
    text: "They transformed my hair with the most beautiful balayage. I get compliments everywhere I go. Thank you, K & S Beauty Centre!",
    service: "Hair Colour",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "text-amber-primary fill-amber-primary"
              : "text-neutral-300 dark:text-neutral-600",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-[85vw] max-w-md rounded-2xl border border-amber-primary/15 bg-white p-6 shadow-sm dark:bg-neutral-800">
      <Stars rating={review.rating} />
      <blockquote className="mt-4 font-serif text-sm leading-relaxed text-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          {review.service && (
            <p className="text-xs text-amber-primary">{review.service}</p>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);

  useEffect(() => {
    fetch("/api/reviews?activeOnly=true")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.length) setReviews(json.data);
      })
      .catch(() => {});
  }, []);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-white dark:bg-neutral-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-rose-light dark:bg-neutral-700 text-amber-primary rounded-full text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            What Our Clients{" "}
            <span className="text-amber-primary">Say About Us</span>
          </h2>

          {average > 0 && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-amber-primary/20 bg-amber-primary/5 px-5 py-2">
              <Stars rating={Math.round(average)} />
              <span className="text-sm font-medium text-foreground">
                {average.toFixed(1)} average rating
              </span>
            </div>
          )}
        </AnimatedSection>
      </div>

      {reviews.length > 0 ? (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-neutral-950" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-neutral-950" />

          <Marquee speed={45} pauseOnHover className="py-2">
            {reviews.map((review) => (
              <MarqueeItem key={review.id}>
                <ReviewCard review={review} />
              </MarqueeItem>
            ))}
          </Marquee>
          <Marquee speed={45} pauseOnHover reverse className="mt-6 py-2">
            {reviews.slice().reverse().map((review) => (
              <MarqueeItem key={review.id}>
                <ReviewCard review={review} />
              </MarqueeItem>
            ))}
          </Marquee>
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-12">
          Reviews coming soon.
        </p>
      )}
    </section>
  );
}
