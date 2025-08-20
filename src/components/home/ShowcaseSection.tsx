
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
        <SectionTitle>Tienda Digital y Herramientas</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-16 text-foreground/70">
          Crea tu identidad visual única con LUTs, presets y herramientas de color inteligentes diseñadas profesionalmente.
        </p>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          <BackgroundGradient containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 md:p-8 flex flex-col">
            <div className="flex-grow">
              <h3 className="font-headline text-3xl text-foreground">Cinematic LUTs</h3>
              <p className="text-foreground/70 mt-4">
                Transforma tu metraje con un solo clic. Mi colección de Look-Up Tables (LUTs) está diseñada para darle a tus videos un etalonaje de color profesional y cinematográfico.
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
                <Link href="/store/video" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                    <span>Explorar LUTs</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </BackgroundGradient>
          
          <BackgroundGradient containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 md:p-8 flex flex-col">
            <div className="flex-grow">
                <h3 className="font-headline text-3xl text-foreground">Lightroom Presets</h3>
                <p className="text-foreground/70 mt-4">
                  Logra un look consistente y pulido en toda tu fotografía. Mis presets para Lightroom proporcionan un punto de partida perfecto para tu visión creativa.
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
                <Link href="/store/photo" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                    <span>Ver Presets</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </BackgroundGradient>
          
          <BackgroundGradient containerClassName="rounded-2xl h-full md:col-span-2 lg:col-span-1" className="rounded-2xl h-full bg-card text-card-foreground p-6 md:p-8 flex flex-col">
            <div className="flex-grow">
                <h3 className="font-headline text-3xl text-foreground">Reverse Grade AI</h3>
                <p className="text-foreground/70 mt-4">
                  ¿Alguna vez te has preguntado cómo conseguir ese look cinematográfico? Sube cualquier imagen de referencia y nuestra IA hará ingeniería inversa del etalonaje, dándote la receta exacta para recrearlo.
                </p>
            </div>
            <div className="mt-6">
                <div className="rounded-lg overflow-hidden mb-6 aspect-video">
                  <Image
                      src="https://placehold.co/1600x900.png"
                      alt="Color AI Showcase"
                      width={1600}
                      height={900}
                      className="w-full h-full object-cover"
                      data-ai-hint="abstract color gradient"
                    />
                </div>
                <Link href="/color-ai" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                    <span>Probar Herramienta</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
          </BackgroundGradient>
        </div>
      </div>
    </motion.section>
  );
}
