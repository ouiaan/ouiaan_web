
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
  id: 2, 
  name: 'Ouiaan Lightroom Presets V1', 
  price: '$15', 
  category: 'Presets', 
  description: 'Resalta verdes ricos y profundos y añade un toque de contraste temperamental, perfecto para fotografía de bosques y naturaleza. Este paquete contiene 10 presets únicos.',
  images: [
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 1", data_ai_hint: 'moody forest' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Moody nature scene 2", data_ai_hint: 'moody nature' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Dark forest scene 3", data_ai_hint: 'dark forest' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Green woods scene 4", data_ai_hint: 'green woods' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Enchanted forest scene 5", data_ai_hint: 'enchanted forest' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Moody path scene 6", data_ai_hint: 'moody path' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Deep woods scene 7", data_ai_hint: 'deep woods' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Forest light scene 8", data_ai_hint: 'forest light' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Misty forest scene 9", data_ai_hint: 'misty forest' },
    { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', alt: "Sunlit forest scene 10", data_ai_hint: 'sunlit forest' },
  ]
};

const faqs = [
  {
    question: "¿Qué software necesito para usar estos presets?",
    answer: "Nuestros presets son compatibles con Adobe Lightroom Classic, Lightroom CC (Escritorio y Móvil), y Adobe Camera Raw."
  },
  {
    question: "¿Cómo instalo los presets?",
    answer: "Después de tu compra, recibirás un enlace de descarga con una guía en PDF que incluye instrucciones de instalación paso a paso para todo el software compatible."
  },
  {
    question: "¿Puedo usarlos en mi teléfono?",
    answer: "¡Sí! Puedes instalarlos en la aplicación gratuita de Adobe Lightroom para editar fotos directamente en tu teléfono."
  },
  {
    question: "¿Qué pasa si no estoy contento con mi compra?",
    answer: "Debido a la naturaleza digital de nuestros productos, generalmente no ofrecemos reembolsos. Sin embargo, si tienes problemas técnicos, por favor contacta a nuestro soporte y estaremos encantados de ayudarte."
  }
];

export default function PhotoStorePage() {
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
