"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ScrollVideoFramesProps {
  totalFrames?: number;
  className?: string;
}

export default function ScrollVideoFrames({
  totalFrames = 80,
  className = "",
}: ScrollVideoFramesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress to frame number
  const frameNumber = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  // Preload all frames
  useEffect(() => {
    const framesToLoad: number[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      framesToLoad.push(i);
    }

    let loadedCount = 0;
    framesToLoad.forEach((frameNum) => {
      const img = new window.Image() as HTMLImageElement;
      img.src = `/video-frames/frame_${String(frameNum).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === framesToLoad.length) {
          console.log(`All ${totalFrames} frames loaded`);
        }
      };
    });
  }, [totalFrames]);

  // Update current frame based on scroll
  useEffect(() => {
    const unsubscribe = frameNumber.on("change", (latest) => {
      setCurrentFrame(Math.round(latest));
    });
    return () => unsubscribe();
  }, [frameNumber]);

  // Generate frame image path
  const getFramePath = useCallback((num: number) => {
    return `/video-frames/frame_${String(num).padStart(4, "0")}.jpg`;
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }} className={className}>
      {/* Sticky frame container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
        className="relative"
      >
        {/* Frame display */}
        <motion.div
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute", inset: 0 }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={getFramePath(currentFrame)}
              alt={`Frame ${currentFrame}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          {/* Dark overlay for text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.25)",
            }}
          />
        </motion.div>

        {/* Content overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="z-10"
        >
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

        {/* Frame counter */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            background: "rgba(0,0,0,0.5)",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            color: "white",
            fontSize: "0.875rem",
          }}
        >
          Frame {currentFrame} / {totalFrames}
        </div>

        {/* Scroll progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8rem",
            height: "2px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "9999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            className="bg-primary-pink h-full"
            style={{
              width: "100%",
              transformOrigin: "left",
              scaleX: scrollYProgress,
            }}
          />
        </div>
      </div>

      {/* Extra scrollable space */}
      <div style={{ height: "150vh" }} />
    </div>
  );
}