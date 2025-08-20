

'use client';

import { SectionTitle } from "@/components/ui/SectionTitle";
import { ColorAIClient } from "./ColorAIClient";
import { motion } from "framer-motion";

export default function ColorAIPage() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle className="text-4xl md:text-5xl">Reverse Grade AI</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Sube una imagen de referencia y usa el gotero para seleccionar los tonos clave. La IA deconstruirá el etalonaje (color grade) en una receta que puedes usar.
      </p>
      <ColorAIClient />
    </motion.div>
  );
}

    
