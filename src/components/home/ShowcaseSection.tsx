import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';

export function ShowcaseSection() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        <SectionTitle>Digital Store</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-16 text-foreground/70">
          Craft your unique visual identity with professionally designed LUTs and presets.
        </p>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="font-headline text-3xl text-foreground">Cinematic LUTs</h3>
            <p className="text-foreground/70">
              Transform your footage with a single click. My collection of Look-Up Tables (LUTs) is designed to give your videos a professional, cinematic color grade, from subtle enhancements to dramatic stylistic shifts.
            </p>
            <Link href="/store" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
              <span>Explore LUTs</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="rounded-lg overflow-hidden">
            <Image
              src="https://placehold.co/800x600.png"
              alt="LUTs Showcase"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              data-ai-hint="cinematic video"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mt-24">
           <div className="rounded-lg overflow-hidden md:order-1">
            <Image
              src="https://placehold.co/800x600.png"
              alt="Presets Showcase"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              data-ai-hint="photo editing"
            />
          </div>
          <div className="space-y-6 md:order-2">
            <h3 className="font-headline text-3xl text-foreground">Photo Presets</h3>
            <p className="text-foreground/70">
              Achieve a consistent, polished look across your photography. My presets for Lightroom and other editing software provide a perfect starting point for your creative vision, saving you time and inspiring new ideas.
            </p>
            <Link href="/store" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
              <span>View Presets</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
