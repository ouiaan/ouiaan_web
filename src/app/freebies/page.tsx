import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowDown } from 'lucide-react';
import { BackgroundGradient } from '@/components/ui/background-gradient';

const freebies = [
  { id: 1, name: 'Free Sample LUT', description: 'A versatile LUT for a clean cinematic look.', image: 'https://placehold.co/600x400.png', data_ai_hint: 'cinematic still' },
  { id: 2, name: 'BW Film Preset', description: 'A classic black and white preset for timeless photos.', image: 'https://placehold.co/600x400.png', data_ai_hint: 'black white' },
  { id: 3, name: '4K Film Grain Overlay', description: 'Add authentic film texture to your videos.', image: 'https://placehold.co/600x400.png', data_ai_hint: 'abstract texture' },
];

export default function FreebiesPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>Free Resources</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Enjoy a selection of free tools to get a taste of the quality and style of my products.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {freebies.map((item) => (
          <BackgroundGradient key={item.id} animate={false} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-6 flex flex-col">
            <div className="overflow-hidden rounded-md mb-4">
              <Image
                src={item.image}
                alt={item.name}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                data-ai-hint={item.data_ai_hint}
              />
            </div>
            <h3 className="font-headline text-2xl text-foreground">{item.name}</h3>
            <p className="text-foreground/70 mt-2 flex-grow">{item.description}</p>
            <Link href="#" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider mt-6">
              <span>Download</span>
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
            </Link>
          </BackgroundGradient>
        ))}
      </div>
    </div>
  );
}
