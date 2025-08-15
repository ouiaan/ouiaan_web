import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';

const products = [
  { id: 1, name: 'Vintage Film LUT Pack', price: '$29', image: 'https://placehold.co/600x400.png', category: 'LUTs', data_ai_hint: 'film camera' },
  { id: 2, name: 'Moody Greens Preset', price: '$15', image: 'https://placehold.co/600x400.png', category: 'Presets', data_ai_hint: 'moody forest' },
  { id: 3, name: 'Urban Night LUTs', price: '$25', image: 'https://placehold.co/600x400.png', category: 'LUTs', data_ai_hint: 'city night' },
  { id: 4, name: 'Desert Tone Presets', price: '$19', image: 'https://placehold.co/600x400.png', category: 'Presets', data_ai_hint: 'desert landscape' },
  { id: 5, name: '8mm Film Grain Overlay', price: '$10', image: 'https://placehold.co/600x400.png', category: 'Overlays', data_ai_hint: 'film grain' },
  { id: 6, name: 'Teal & Orange LUT', price: '$12', image: 'https://placehold.co/600x400.png', category: 'LUTs', data_ai_hint: 'beach sunset' },
];

export default function StorePage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>The Store</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Browse the full collection of digital tools designed to elevate your creative work.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link href="#" key={product.id} className="group block">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={product.data_ai_hint}
              />
            </div>
            <div className="mt-4">
              <h3 className="font-headline text-xl text-foreground">{product.name}</h3>
              <p className="text-accent font-body mt-1">{product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
