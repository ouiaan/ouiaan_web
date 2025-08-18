'use client';

import { SectionTitle } from "@/components/ui/SectionTitle";
import { motion } from "framer-motion";

export default function Test2Page() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>Test 2 Page</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        This is a new, clean page to continue our work.
      </p>
    </motion.div>
  );
}
