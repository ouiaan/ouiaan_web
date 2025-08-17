
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const products = [
  { 
    id: 2, 
    name: 'Moody Greens Preset', 
    price: '$15', 
    category: 'Presets', 
    description: 'Brings out rich, deep greens and adds a touch of moody contrast, perfect for forest and nature photography.',
    images: [
      { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene", data_ai_hint: 'moody forest' },
      { src: 'https://placehold.co/1600x900.png', alt: "Lush green landscape", data_ai_hint: 'lush landscape' },
      { src: 'https://placehold.co/1600x900.png', alt: "Dark and moody portrait", data_ai_hint: 'moody portrait' },
      { src: 'https://placehold.co/1600x900.png', alt: "Ferns in a forest", data_ai_hint: 'forest ferns' },
      { src: 'https://placehold.co/1600x900.png', alt: "Mountain with green tones", data_ai_hint: 'green mountain' },
      { src: 'https://placehold.co/1600x900.png', alt: "Woman in a green dress", data_ai_hint: 'woman nature' },
      { src: 'https://placehold.co/1600x900.png', alt: "Close up of leaves", data_ai_hint: 'green leaves' },
      { src: 'https://placehold.co/1600x900.png', alt: "Jungle canopy", data_ai_hint: 'jungle canopy' },
      { src: 'https://placehold.co/1600x900.png', alt: "Path through a green tunnel", data_ai_hint: 'garden path' },
      { src: 'https://placehold.co/1600x900.png', alt: "Overhead shot of a forest", data_ai_hint: 'forest drone' },
    ]
  },
];

const faqs = [
  {
    question: "What software do I need to use these presets?",
    answer: "Our presets are compatible with Adobe Lightroom Classic, Lightroom CC (Desktop & Mobile), and Adobe Camera Raw."
  },
  {
    question: "How do I install the presets?",
    answer: "After your purchase, you'll receive a download link with a PDF guide that includes step-by-step installation instructions for all compatible software."
  },
  {
    question: "Can I use these on my phone?",
    answer: "Yes! You can install them in the free Adobe Lightroom mobile app to edit photos directly on your phone."
  },
  {
    question: "What if I'm not happy with my purchase?",
    answer: "Due to the digital nature of our products, we generally do not offer refunds. However, if you are experiencing technical issues, please contact our support, and we'll be happy to help."
  }
];

export default function PhotoStorePage() {
  const product = products[0];

  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>{product.name}</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        {product.description}
      </p>

      <div className="max-w-5xl mx-auto">
        <BackgroundGradient animate={true} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-4 flex flex-col">
          <div className="relative w-full">
              <Carousel
                opts={{
                  dragFree: false,
                  draggable: false,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                        <Card>
                            <CardContent className="p-4 bg-secondary rounded-lg aspect-[16/9]">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={1600}
                                    height={900}
                                    className="w-full h-full object-cover rounded-md"
                                    data-ai-hint={image.data_ai_hint}
                                />
                            </CardContent>
                        </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full" />
              </Carousel>
          </div>
          <div className="flex justify-between items-center mt-6 px-2">
            <span className="text-accent font-headline text-3xl">{product.price}</span>
            <Button size="lg" className="bg-primary">Add to Cart</Button>
          </div>
        </BackgroundGradient>
      </div>
      
      <div className="max-w-3xl mx-auto mt-20">
        <h3 className="font-headline text-3xl text-center mb-8">Frequently Asked Questions</h3>
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
      </div>

    </div>
  );
}
