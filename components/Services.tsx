"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, HandHeart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AnimatedSection from "./animations/AnimatedSection";

const services = [
  {
    icon: Scissors,
    title: "Hair Styling",
    description:
      "From precision cuts to vibrant colour transformations, our expert stylists craft looks that reflect your unique personality and style.",
    features: ["Cut & Style", "Colour & Highlights", "Treatments", "Bridal Hair"],
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Facials",
    description:
      "Rejuvenate your skin with our customized facial treatments. Using premium products, we help you achieve a radiant, youthful glow.",
    features: ["Deep Cleansing", "Anti-Aging", "Hydration", "LED Therapy"],
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    icon: HandHeart,
    title: "Massage",
    description:
      "Unwind and rejuvenate with our therapeutic massage services. From relaxation to deep tissue, find your perfect escape.",
    features: ["Swedish Massage", "Deep Tissue", "Aromatherapy", "Hot Stone"],
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

export default function Services() {
  return (
    <section
      id="services"
      className="py-24 md:py-32 bg-blush-light relative overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-crimson-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blush-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <AnimatedSection
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 bg-white text-crimson-primary rounded-full text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Pamper Yourself with{" "}
            <span className="text-crimson-primary">Luxury Treatments</span>
          </h2>
          <p className="text-text-light text-base sm:text-lg leading-relaxed">
            Discover our comprehensive range of beauty and wellness services,
            designed to help you look and feel your absolute best.
          </p>
        </AnimatedSection>

        {/* Staggered Cards Grid */}
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {services.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -8 : 0,
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.12)"
          : "0 4px 20px rgba(0,0,0,0.06)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="bg-white rounded-2xl overflow-hidden shadow-xl h-full flex flex-col will-change-transform will-change-box-shadow cursor-pointer"
    >
      {/* Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.7, ease: defaultEasing }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        {/* Icon with Morphing */}
        <div className="mb-6">
          <div className="relative w-14 h-14">
            {/* Morph ring */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  key="morph-ring"
                  className="absolute inset-0 rounded-full border-2 border-crimson-primary"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            {/* Icon circle */}
            <motion.div
              className="relative w-14 h-14 rounded-full flex items-center justify-center"
              animate={{
                backgroundColor: hovered ? "#9caf88" : "#f2c4ce",
                scale: hovered ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ backgroundColor: "#f2c4ce" }}
            >
              <motion.div
                animate={{
                  scale: hovered ? 1.15 : 1,
                  rotate: hovered ? [0, -8, 8, 0] : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
          </div>

          {/* Accent underline */}
          <motion.div
            className="h-0.5 bg-crimson-primary rounded-full mt-4"
            animate={{
              width: hovered ? "100%" : "0%",
              opacity: hovered ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ maxWidth: "3rem" }}
          />
        </div>

        <h3 className="text-2xl font-serif font-bold text-text-dark mb-4">
          {service.title}
        </h3>

        <p className="text-text-light leading-relaxed mb-6 flex-1">
          {service.description}
        </p>

        {/* Features */}
        <ul className="space-y-2">
          {service.features.map((feature, i) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-text-dark"
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-crimson-primary block shrink-0"
                animate={{
                  scale: hovered ? [1, 1.5, 1] : 1,
                }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* Learn More link */}
        <motion.div
          className="mt-6 pt-6 border-t border-gray-100"
          animate={{ opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-crimson-primary font-medium text-sm flex items-center gap-2">
            Learn More
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              &rarr;
            </motion.span>
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
