
'use client';

import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent } from '@/components/ui/card';
import { ImageComparisonSlider } from '@/components/ui/image-comparison-slider';

const products = [
  { 
    id: 2, 
    name: 'Moody Greens Preset', 
    price: '$15', 
    category: 'Presets', 
    description: 'Brings out rich, deep greens and adds a touch of moody contrast, perfect for forest and nature photography.',
    images: [
      { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', data_ai_hint_before: 'forest path', data_ai_hint_after: 'moody forest', alt: "Forest path" },
      { before: 'https://placehold.co/1600x900.png', after: 'https://placehold.co/1600x900.png', data_ai_hint_before: 'mountain lake', data_ai_hint_after: 'moody landscape', alt: "Mountain lake" },
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
  const product = products[0]; // For this example, we're focusing on one product

  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>{product.name}</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        {product.description}
      </p>

      <div className="max-w-5xl mx-auto">
        <BackgroundGradient animate={true} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-4 flex flex-col">
          <Carousel className="w-full" opts={{ dragFree: false }}>
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="p-4 bg-secondary rounded-lg">
                          <ImageComparisonSlider
                            beforeImage={{ src: img.before, alt: `Before ${img.alt}`, 'data-ai-hint': img.data_ai_hint_before }}
                            afterImage={{ src: img.after, alt: `After ${img.alt}`, 'data-ai-hint': img.data_ai_hint_after }}
                          />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
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
