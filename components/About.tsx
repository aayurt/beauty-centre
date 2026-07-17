"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import CountUp from "./animations/CountUp";
import TextReveal from "./animations/TextReveal";
import { Sparkles, MapPin, Users, Building2, Award } from "lucide-react";

const milestones = [
  {
    year: "1980s",
    title: "The Pioneer Era",
    description:
      "Founded by Mr. Keshav in Jamal, Kathmandu, K & S Beauty Centre emerged when fewer than ten professional hair salons existed in the entire valley — securing a defining first-mover advantage.",
    icon: Sparkles,
  },
  {
    year: "1990s",
    title: "Growth & Recognition",
    description:
      "As Kathmandu transformed from a centralized marketplace to a sophisticated service economy, the salon expanded its clientele and became a trusted institution for beauty in the capital.",
    icon: Building2,
  },
  {
    year: "2000s",
    title: "Generational Leadership",
    description:
      "Navigating the complexities of generational leadership, the centre maintained its legacy while adapting to the changing beauty landscape of a rapidly modernizing Kathmandu Valley.",
    icon: Users,
  },
  {
    year: "2010s",
    title: "Digital Integration",
    description:
      "Embracing the digital transformation sweeping Nepal's service sector, K & S Beauty Centre began its journey of technological integration — modernizing operations while preserving its heritage.",
    icon: Award,
  },
];

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const defaultEasing = [0.25, 0.1, 0.25, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: defaultEasing,
    },
  },
};

function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <div ref={ref} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-crimson-primary to-crimson-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/90 px-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border-2 border-white/20"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2">Since 1980s</p>
            <p className="text-white/70 text-sm uppercase tracking-widest">Jamal, Kathmandu</p>
          </div>
        </div>
      </motion.div>
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <span className="text-crimson-primary font-bold text-sm flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          Jamal, Kathmandu
        </span>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-blush-light/60 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-crimson-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-32">
          <AnimatedSection direction="left" className="relative">
            <ParallaxImage />
              <div className="absolute -bottom-6 -right-6 w-32 sm:w-48 h-32 sm:h-48 bg-blush-light rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-24 sm:w-32 h-24 sm:h-32 border-2 border-crimson-primary/30 rounded-2xl -z-10" />
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="max-w-lg">
              <span className="inline-block px-4 py-2 bg-blush-light text-crimson-primary rounded-full text-sm font-medium mb-6">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6 leading-tight">
                A Pioneer of{" "}
                <span className="text-crimson-primary">Beauty in Kathmandu</span>
              </h2>
              <TextReveal
                text="K & S Beauty Centre, nestled in the historic Jamal district of Kathmandu, stands as a testament to vision and resilience. At a time when fewer than ten professional hair salons operated across the entire Kathmandu Valley, founder Mr. Keshav dared to pioneer — securing a first-mover advantage that would define the salon's trajectory for generations."
                className="text-text-light leading-relaxed mb-6 text-base sm:text-lg"
              />
              <TextReveal
                text="From those humble beginnings in a centralized traditional marketplace, the centre has evolved alongside Kathmandu's transformation into a sophisticated service economy. Today, it remains a primary case study in understanding the evolution of Nepal's beauty and wellness sector — a beacon of urban prosperity and social change."
                className="text-text-light leading-relaxed mb-8 text-base sm:text-lg"
              />

              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-crimson-primary">
                    <CountUp from={0} to={4} suffix="+" duration={2} />
                  </div>
                  <div className="text-xs sm:text-sm text-text-light">Decades of Beauty</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-crimson-primary">
                    <CountUp from={0} to={10} suffix="+" duration={2} />
                  </div>
                  <div className="text-xs sm:text-sm text-text-light">Pioneer #{""} Establishment</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-crimson-primary">
                    <CountUp from={0} to={1} suffix="K+" duration={2} />
                  </div>
                  <div className="text-xs sm:text-sm text-text-light">Happy Clients</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Timeline Section */}
        <AnimatedSection direction="up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-2 bg-blush-light text-crimson-primary rounded-full text-sm font-medium mb-6">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-text-dark mb-6">
              The Story of{" "}
              <span className="text-crimson-primary">A Beauty Institution</span>
            </h2>
            <p className="text-text-light text-base sm:text-lg leading-relaxed">
              From the commercial landscape of a transforming Kathmandu Valley to a
              modern digital-ready enterprise — every chapter reflects the spirit
              of Nepali entrepreneurship.
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          className="timeline max-w-4xl mx-auto"
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.year}
              className="timeline-item"
              variants={itemVariants}
            >
              <div className="timeline-dot" />
              <div className="timeline-content group hover:border-crimson-primary/40 hover:shadow-xl transition-all duration-500">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-blush-light flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.1, backgroundColor: "#9caf88" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <milestone.icon className="w-5 h-5 text-crimson-primary group-hover:text-white transition-colors" />
                  </motion.div>
                  <div className="flex-1">
                    <span className="timeline-year">{milestone.year}</span>
                    <h3 className="timeline-title">{milestone.title}</h3>
                    <p className="timeline-description">{milestone.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quote Section */}
        <AnimatedSection direction="up" className="mt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <svg
                className="absolute -top-8 -left-8 w-16 h-16 text-blush-secondary/30 -z-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>
              <TextReveal
                text="K & S Beauty Centre is not merely a salon — it is a living chronicle of Kathmandu's transformation, a pioneer that shaped an industry, and a family legacy that continues to define beauty in Nepal."
                as="blockquote"
                className="text-xl sm:text-2xl md:text-3xl font-serif italic text-text-dark leading-relaxed"
              />
              <div className="mt-6">
                <p className="font-bold text-text-dark">— Mr. Keshav</p>
                <p className="text-text-light text-sm">Founder, K & S Beauty Centre</p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
