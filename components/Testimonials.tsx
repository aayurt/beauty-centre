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
              ? "text-amber-text fill-amber-primary"
              : "text-neutral-300 dark:text-neutral-600",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-[85vw] max-w-md rounded-2xl border border-amber-primary/15 bg-white p-6 shadow-sm dark:bg-neutral-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <Stars rating={review.rating} />
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <svg className="size-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google Review
          </span>
        </div>
        <blockquote className="mt-4 font-serif text-sm leading-relaxed text-foreground">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      </div>
      <footer className="mt-5 flex items-center justify-between pt-3 border-t border-border/40">
        <div>
          <p className="text-sm font-semibold text-foreground">{review.name}</p>
          {review.service && (
            <p className="text-xs text-amber-text">{review.service}</p>
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
          <span className="inline-block px-4 py-2 bg-rose-light dark:bg-neutral-700 text-amber-text rounded-full text-sm font-medium mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            What Our Clients{" "}
            <span className="text-amber-text">Say About Us</span>
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
