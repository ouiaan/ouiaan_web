
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowRight } from 'lucide-react';
import { BackgroundGradient } from '@/components/ui/background-gradient';

const photoProducts = [
  { id: 2, name: 'Moody Greens Preset', price: '$15', image: 'https://placehold.co/1600x900.png', category: 'Presets', data_ai_hint: 'moody forest' },
  { id: 4, name: 'Desert Tone Presets', price: '$19', image: 'https://placehold.co/1600x900.png', category: 'Presets', data_ai_hint: 'desert landscape' },
];

const videoProducts = [
  { id: 1, name: 'Vintage Film LUT Pack', price: '$29', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'film camera' },
  { id: 3, name: 'Urban Night LUTs', price: '$25', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'city night' },
  { id: 5, name: '8mm Film Grain Overlay', price: '$10', image: 'https://placehold.co/1600x900.png', category: 'Overlays', data_ai_hint: 'film grain' },
  { id: 6, name: 'Teal & Orange LUT', price: '$12', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'beach sunset' },
];

export default function StorePage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>The Store</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Browse the full collection of digital tools designed to elevate your creative work.
      </p>

      {/* Photo Section */}
      <div className="mb-20">
        <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground">Photo Presets</h2>
            <Link href="/store/photo" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                <span>View All</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {photoProducts.slice(0, 3).map((product) => (
            <Link href="/store/photo" key={product.id}>
              <BackgroundGradient animate={true} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-4 flex flex-col">
                  <div className="overflow-hidden rounded-md mb-4 aspect-video">
                      <Image
                      src={product.image}
                      alt={product.name}
                      width={1600}
                      height={900}
                      className="w-full h-full object-cover"
                      data-ai-hint={product.data_ai_hint}
                      />
                  </div>
                  <div className="flex flex-col flex-grow">
                      <h3 className="font-headline text-xl text-foreground">{product.name}</h3>
                      <p className="text-accent font-headline text-lg mt-auto pt-4">{product.price}</p>
                  </div>
              </BackgroundGradient>
            </Link>
          ))}
        </div>
      </div>

      {/* Video Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-3xl md:text-4xl text-foreground">Video LUTs & Overlays</h2>
            <Link href="/store/video" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider">
                <span>View All</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoProducts.slice(0, 3).map((product) => (
            <Link href="/store/video" key={product.id}>
              <BackgroundGradient animate={true} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-4 flex flex-col">
                  <div className="overflow-hidden rounded-md mb-4 aspect-video">
                      <Image
                      src={product.image}
                      alt={product.name}
                      width={1600}
                      height={900}
                      className="w-full h-full object-cover"
                      data-ai-hint={product.data_ai_hint}
                      />
                  </div>
                  <div className="flex flex-col flex-grow">
                      <h3 className="font-headline text-xl text-foreground">{product.name}</h3>
                      <p className="text-accent font-headline text-lg mt-auto pt-4">{product.price}</p>
                  </div>
              </BackgroundGradient>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
