
'use client';

import * as React from 'react';
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const images = [
  { src: "https://placehold.co/1600x900.png", alt: "Abstract cityscape", data_ai_hint: "abstract cityscape" },
  { src: "https://placehold.co/1600x900.png", alt: "Minimalist portrait", data_ai_hint: "minimalist portrait" },
  { src: "https://placehold.co/1600x900.png", alt: "Moody landscape", data_ai_hint: "moody landscape" },
  { src: "https://placehold.co/1600x900.png", alt: "Street photography", data_ai_hint: "street photography" },
  { src: "https://placehold.co/1600x900.png", alt: "Nature detail", data_ai_hint: "nature detail" },
  { src: "https://placehold.co/1600x900.png", alt: "Fashion shot", data_ai_hint: "fashion shot" },
  { src: "https://placehold.co/1600x900.png", alt: "Architecture", data_ai_hint: "architecture details" },
  { src: "https://placehold.co/1600x900.png", alt: "Product Shot", data_ai_hint: "product shot" },
];

export function FeaturedWork() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle>Featured Work</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
          A curated selection of my favorite shots, showcasing the power of light, color, and composition.
        </p>
        <div className="relative">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[16/9] relative group">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            data-ai-hint={image.data_ai_hint}
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
