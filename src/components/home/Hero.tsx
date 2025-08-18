
"use client";

import { Spotlight } from "@/components/ui/Spotlight";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      {/* Video Background Placeholder */}
      <div className="absolute top-0 left-0 w-full h-full bg-black z-0">
        {/* In a real application, a <video> tag would go here. */}
        {/* e.g., <video autoPlay loop muted className="w-full h-full object-cover" src="/path/to/video.mp4" /> */}
        <div className="w-full h-full object-cover bg-black" />
      </div>
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center text-white p-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          Ouiaan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto"
        >
          Digital assets for the modern creator.
        </motion.p>
      </div>
    </section>
  );
}
