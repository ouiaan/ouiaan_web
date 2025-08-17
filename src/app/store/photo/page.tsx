
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

const product = { 
  id: 2, 
  name: 'Moody Greens Preset Pack', 
  price: '$15', 
  category: 'Presets', 
  description: 'Brings out rich, deep greens and adds a touch of moody contrast, perfect for forest and nature photography. This pack contains 10 unique presets.',
  image: { src: 'https://placehold.co/1600x900.png', alt: "Moody forest scene", data_ai_hint: 'moody forest' },
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
        <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card p-0">
          <div className="grid md:grid-cols-2">
              <div className="aspect-video relative rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
                  <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      className="object-cover"
                      data-ai-hint={product.image.data_ai_hint}
                  />
              </div>
              <div className="flex flex-col p-8 md:p-12">
                  <h3 className="font-headline text-3xl text-foreground">{product.name}</h3>
                  <p className="text-foreground/70 mt-4 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-8">
                      <span className="text-accent font-headline text-4xl">{product.price}</span>
                      <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Add to Cart</Button>
                  </div>
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
