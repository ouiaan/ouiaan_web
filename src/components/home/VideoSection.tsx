
'use client';

import { SectionTitle } from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";

export function VideoSection() {
  return (
    <motion.section 
      className="py-20 md:py-32 bg-background relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle>Desde el Canal</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
          Profundiza en mi proceso creativo y aprende nuevas técnicas con tutoriales y contenido detrás de cámaras de mi canal de YouTube.
        </p>
        <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/NjDwRcBx_Dw"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </motion.section>
  );
}
