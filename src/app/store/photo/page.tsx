
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';

const products = [
  { id: 2, name: 'Moody Greens Preset', price: '$15', image: 'https://placehold.co/1600x900.png', category: 'Presets', data_ai_hint: 'moody forest' },
  { id: 4, name: 'Desert Tone Presets', price: '$19', image: 'https://placehold.co/1600x900.png', category: 'Presets', data_ai_hint: 'desert landscape' },
];

export default function PhotoStorePage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>Photo Presets</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Achieve a consistent, polished look across your photography with high-quality presets.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link href="#" key={product.id}>
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
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-accent font-headline text-lg">{product.price}</span>
                        <Button size="sm" variant="secondary">View Details</Button>
                    </div>
                </div>
            </BackgroundGradient>
          </Link>
        ))}
      </div>
    </div>
  );
}
