
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

const product = { 
  id: 1, 
  name: 'Ouiaan V1 LUT Pack', 
  price: '$29', 
  category: 'LUTs', 
  description: 'A collection of 15 unique LUTs designed to give your footage a nostalgic, cinematic film look. Perfect for everything from travel videos to short films.',
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
    question: "What software is compatible with these LUTs?",
    answer: "Our LUTs (.cube files) are compatible with most major video editing software, including Adobe Premiere Pro, Final Cut Pro X, DaVinci Resolve, and Filmora."
  },
  {
    question: "How will I receive the LUTs after purchase?",
    answer: "You will receive an email with a secure download link immediately after your payment is processed. The download includes the LUT files and a PDF installation guide."
  },
  {
    question: "Can I use these LUTs on photos?",
    answer: "While LUTs are designed for video, they can be used in photo editing software like Adobe Photoshop. However, for best results on photos, we recommend our dedicated photo presets."
  },
  {
    question: "What is your refund policy?",
    answer: "Due to the digital nature of our products, all sales are final and we cannot offer refunds. If you encounter any issues with your files, please contact our support and we'll be happy to assist you."
  }
];

export default function VideoStorePage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
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
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xl">Buy Now</Button>
              </div>
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
