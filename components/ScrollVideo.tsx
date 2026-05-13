"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll } from "framer-motion";

interface ScrollVideoProps {
  src: string;
  className?: string;
}

export default function ScrollVideo({ src, className = "" }: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Handle video metadata load
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  // Seek video based on scroll position
  useEffect(() => {
    if (!videoDuration || !videoRef.current) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const video = videoRef.current;
      if (video && videoDuration > 0) {
        const seekTime = videoDuration * progress;
        video.currentTime = seekTime;
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, videoDuration]);

  return (
    <div ref={containerRef} style={{ position: "relative" }} className={className}>
      {/* Sticky video container */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }} className="relative">
        {/* Video layer */}
        <motion.div
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
          />
          {/* Dark overlay for text readability */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        </motion.div>

        {/* Content overlay */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }} className="z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-6"
          >
            <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-medium">
              Experience Beauty
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              The Art of Transformation
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto font-light opacity-90">
              Scroll to explore our world of luxury beauty treatments
            </p>
          </motion.div>
        </div>

        {/* Scroll progress bar */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", width: "8rem", height: "2px", background: "rgba(255,255,255,0.2)", borderRadius: "9999px", overflow: "hidden" }}>
          <motion.div
            className="bg-primary-pink h-full"
            style={{ width: "100%", transformOrigin: "left", scaleX: scrollYProgress }}
          />
        </div>
      </div>

      {/* Extra scrollable space */}
      <div style={{ height: "300vh" }} />
    </div>
  );
}