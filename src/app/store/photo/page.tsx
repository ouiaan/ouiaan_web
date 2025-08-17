
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
import { PhotoBackgroundGradient } from '@/components/ui/PhotoBackgroundGradient';
import { ImageComparisonSlider } from '@/components/ui/ImageComparisonSlider';

const product = { 
  id: 2, 
  name: 'Ouiaan V1 Preset Pack', 
  price: '$15', 
  category: 'Presets', 
  description: 'Brings out rich, deep greens and adds a touch of moody contrast, perfect for forest and nature photography. This pack contains 10 unique presets.',
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
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>{product.name}</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        {product.description}
      </p>

      <div className="max-w-4xl mx-auto">
        <PhotoBackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card p-6 md:p-8">
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
        </PhotoBackgroundGradient>
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
