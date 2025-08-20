
'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { ImageComparisonSlider } from '@/components/ui/ImageComparisonSlider';
import { motion } from 'framer-motion';

const product = { 
  id: 1, 
  name: 'Ouiaan Cinematic LUTs V1', 
  price: '$29', 
  category: 'LUTs', 
  description: 'Una colección de 15 LUTs únicos diseñados para darle a tu metraje un look de película nostálgico y cinematográfico. Perfecto para todo, desde videos de viajes hasta cortometrajes.',
  images: [
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Vintage film look 1", data_ai_hint: 'vintage film' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Cinematic scene 2", data_ai_hint: 'cinematic scene' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Film aesthetic 3", data_ai_hint: 'film aesthetic' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Retro video look 4", data_ai_hint: 'retro video' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Nostalgic color grade 5", data_ai_hint: 'nostalgic color' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Moody film scene 6", data_ai_hint: 'moody film' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Indie film look 7", data_ai_hint: 'indie film' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Analog film style 8", data_ai_hint: 'analog film' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Warm film tones 9", data_ai_hint: 'warm film' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Cool film tones 10", data_ai_hint: 'cool film' },
  ]
};

const faqs = [
  {
    question: "¿Qué software es compatible con estos LUTs?",
    answer: "Nuestros LUTs (archivos .cube) son compatibles con la mayoría de los principales programas de edición de video, incluyendo Adobe Premiere Pro, Final Cut Pro X, DaVinci Resolve y Filmora."
  },
  {
    question: "¿Cómo recibiré los LUTs después de la compra?",
    answer: "Recibirás un correo electrónico con un enlace de descarga seguro inmediatamente después de que se procese tu pago. La descarga incluye los archivos LUT y una guía de instalación en PDF."
  },
  {
    question: "¿Puedo usar estos LUTs en fotos?",
    answer: "Aunque los LUTs están diseñados para video, pueden usarse en software de edición de fotos como Adobe Photoshop. Sin embargo, para obtener los mejores resultados en fotos, recomendamos nuestros presets de fotos dedicados."
  },
  {
    question: "¿Cuál es su política de reembolso?",
    answer: "Debido a la naturaleza digital de nuestros productos, todas las ventas son finales y no podemos ofrecer reembolsos. Si encuentras algún problema con tus archivos, por favor contacta a nuestro soporte y estaremos encantados de ayudarte."
  }
];

export default function VideoStorePage() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>{product.name}</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        {product.description}
      </p>

      <div className="max-w-4xl mx-auto">
        <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card p-6 md:p-8">
          <div className="flex flex-col gap-8">
              <Carousel 
                className="relative"
                opts={{
                  watchDrag: false,
                }}
              >
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                       <ImageComparisonSlider
                        before={image.before}
                        after={image.after}
                        alt={image.alt}
                        data_ai_hint={image.data_ai_hint}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
              </Carousel>

              <div className="flex items-center justify-between mt-4">
                  <span className="text-accent font-headline text-4xl">{product.price}</span>
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl">Comprar Ahora</Button>
              </div>
          </div>
        </BackgroundGradient>
      </div>
      
      <motion.div 
        className="max-w-3xl mx-auto mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-headline text-3xl text-center mb-8">Preguntas Frecuentes</h3>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="font-headline text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-foreground/80">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

    </motion.div>
  );
}
