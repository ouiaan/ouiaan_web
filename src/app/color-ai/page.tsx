

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
        Upload a reference image and use the eyedropper to select the key tones. The AI will deconstruct the color grade into an actionable recipe.
      </p>
      <ColorAIClient />
    </motion.div>
  );
}

    
