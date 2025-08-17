
'use client';

import Image from 'next/image';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackgroundGradient } from '@/components/ui/background-gradient';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const product = { 
  id: 2, 
  name: 'Moody Greens Preset Pack', 
  price: '$15', 
  category: 'Presets', 
  description: 'Brings out rich, deep greens and adds a touch of moody contrast, perfect for forest and nature photography. This pack contains 10 unique presets.',
  images: [
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 1", data_ai_hint: 'moody forest' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 2", data_ai_hint: 'moody nature' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 3", data_ai_hint: 'dark forest' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 4", data_ai_hint: 'green woods' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 5", data_ai_hint: 'enchanted forest' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 6", data_ai_hint: 'moody path' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 7", data_ai_hint: 'deep woods' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 8", data_ai_hint: 'forest light' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 9", data_ai_hint: 'misty forest' },
    { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene 10", data_ai_hint: 'sunlit forest' },
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
        <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card p-6 md:p-8">
          <div className="flex flex-col gap-8">
              <div className="text-center">
                  <h3 className="font-headline text-3xl text-foreground">{product.name}</h3>
                  <p className="text-foreground/70 mt-2 max-w-xl mx-auto">{product.description}</p>
              </div>

              <Carousel 
                className="relative"
                opts={{
                  watchDrag: false,
                }}
              >
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-video relative rounded-xl overflow-hidden">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                          data-ai-hint={image.data_ai_hint}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-[-50px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-50px] top-1/2 -translate-y-1/2" />
              </Carousel>

              <div className="flex items-center justify-between mt-4">
                  <span className="text-accent font-headline text-4xl">{product.price}</span>
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Buy Now</Button>
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
