
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BackgroundGradient } from '../ui/background-gradient';
import { motion } from "framer-motion";

export function ShowcaseSection() {
  return (
    <motion.section 
      className="py-20 md:py-32 bg-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <SectionTitle>Digital Store</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-16 text-foreground/70">
          Craft your unique visual identity with professionally designed LUTs and presets.
        </p>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <BackgroundGradient containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 md:p-8 flex flex-col">
            <div className="flex-grow">
              <h3 className="font-headline text-3xl text-foreground">Cinematic LUTs</h3>
              <p className="text-foreground/70 mt-4">
                Transform your footage with a single click. My collection of Look-Up Tables (LUTs) is designed to give your videos a professional, cinematic color grade, from subtle enhancements to dramatic stylistic shifts.
              </p>
            </div>
            <div className="mt-6">
                <div className="rounded-lg overflow-hidden mb-6 aspect-video">
                  <Image
                    src="https://placehold.co/1600x900.png"
                    alt="LUTs Showcase"
                    width={1600}
                    height={900}
                    className="w-full h-full object-cover"
                    data-ai-hint="cinematic video"
                  />
                </div>
                <Link href="/store" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                    <span>Explore LUTs</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </BackgroundGradient>
          
          <BackgroundGradient containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 md:p-8 flex flex-col">
            <div className="flex-grow">
                <h3 className="font-headline text-3xl text-foreground">Photo Presets</h3>
                <p className="text-foreground/70 mt-4">
                  Achieve a consistent, polished look across your photography. My presets for Lightroom and other editing software provide a perfect starting point for your creative vision, saving you time and inspiring new ideas.
                </p>
            </div>
            <div className="mt-6">
                <div className="rounded-lg overflow-hidden mb-6 aspect-video">
                  <Image
                      src="https://placehold.co/1600x900.png"
                      alt="Presets Showcase"
                      width={1600}
                      height={900}
                      className="w-full h-full object-cover"
                      data-ai-hint="photo editing"
                    />
                </div>
                <Link href="/store" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                    <span>View Presets</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </motion.section>
  );
}
