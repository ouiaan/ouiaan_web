import Image from "next/image";
import { SectionTitle } from "@/components/ui/SectionTitle";

const images = [
  { src: "https://placehold.co/800x1200.png", alt: "Abstract cityscape", data_ai_hint: "abstract cityscape" },
  { src: "https://placehold.co/800x800.png", alt: "Minimalist portrait", data_ai_hint: "minimalist portrait" },
  { src: "https://placehold.co/800x600.png", alt: "Moody landscape", data_ai_hint: "moody landscape" },
  { src: "https://placehold.co/800x1000.png", alt: "Street photography", data_ai_hint: "street photography" },
  { src: "https://placehold.co/800x700.png", alt: "Nature detail", data_ai_hint: "nature detail" },
  { src: "https://placehold.co/800x1100.png", alt: "Fashion shot", data_ai_hint: "fashion shot" },
];

export function FeaturedWork() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle>Featured Work</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
          A curated selection of my favorite shots, showcasing the power of light, color, and composition.
        </p>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="mb-4 break-inside-avoid group overflow-hidden rounded-lg relative">
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={1200}
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={image.data_ai_hint}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
