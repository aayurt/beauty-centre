import AnimatedSection from "./AnimatedSection";
import { Scissors, Sparkles, HandHeart } from "lucide-react";
import Image from "next/image";

const services = [
  {
    icon: Scissors,
    title: "Hair Styling",
    description: "From precision cuts to vibrant colour transformations, our expert stylists craft looks that reflect your unique personality and style.",
    features: ["Cut & Style", "Colour & Highlights", "Treatments", "Bridal Hair"],
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Facials",
    description: "Rejuvenate your skin with our customized facial treatments. Using premium products, we help you achieve a radiant, youthful glow.",
    features: ["Deep Cleansing", "Anti-Aging", "Hydration", "LED Therapy"],
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
  },
  {
    icon: HandHeart,
    title: "Massage",
    description: "Unwind and rejuvenate with our therapeutic massage services. From relaxation to deep tissue, find your perfect escape.",
    features: ["Swedish Massage", "Deep Tissue", "Aromatherapy", "Hot Stone"],
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-primary-pink-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-white text-sage-green rounded-full text-sm font-medium mb-6">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
            Pamper Yourself with{" "}
            <span className="text-sage-green">Luxury Treatments</span>
          </h2>
          <p className="text-text-light text-lg leading-relaxed">
            Discover our comprehensive range of beauty and wellness services, designed to help you look and feel your absolute best.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.title}
              direction="up"
              delay={index * 0.2}
              className="h-full"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group h-full flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-primary-pink flex items-center justify-center mb-6 group-hover:bg-sage-green transition-colors duration-300">
                    <service.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-text-dark mb-4">
                    {service.title}
                  </h3>
                  <p className="text-text-light leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-text-dark"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-green" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}