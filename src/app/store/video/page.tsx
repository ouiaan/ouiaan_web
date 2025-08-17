
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';

const products = [
  { id: 1, name: 'Vintage Film LUT Pack', price: '$29', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'film camera' },
  { id: 3, name: 'Urban Night LUTs', price: '$25', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'city night' },
  { id: 5, name: '8mm Film Grain Overlay', price: '$10', image: 'https://placehold.co/1600x900.png', category: 'Overlays', data_ai_hint: 'film grain' },
  { id: 6, name: 'Teal & Orange LUT', price: '$12', image: 'https://placehold.co/1600x900.png', category: 'LUTs', data_ai_hint: 'beach sunset' },
];

export default function VideoStorePage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>Video Assets</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Transform your footage with cinematic LUTs and high-quality video overlays.
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
                    <p className="text-foreground/70 mt-1 flex-grow">
                      {product.category}
                    </p>
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
