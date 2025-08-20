
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowDown } from 'lucide-react';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { motion } from 'framer-motion';

const freebies = [
  { 
    id: 1, 
    name: 'PSD Wiggle Effect', 
    description: 'Add a dynamic, eye-catching wiggle distortion to your text or images with this easy-to-use PSD effect.', 
    image: 'https://placehold.co/1600x900.png', 
    data_ai_hint: 'abstract glitch',
    link: 'https://sub2get.com/link?l=9208' 
  },
  { 
    id: 2, 
    name: 'Polaroid Frame Mockup', 
    description: 'Give your photos a nostalgic, classic feel with this high-resolution Polaroid frame mockup.', 
    image: 'https://placehold.co/1600x900.png', 
    data_ai_hint: 'polaroid frame',
    link: 'https://sub2get.com/link?l=9544' 
  },
  { 
    id: 3, 
    name: 'Free Sample LUT', 
    description: 'A versatile cinematic LUT to give your footage a professional and stylized color grade.', 
    image: 'https://placehold.co/1600x900.png', 
    data_ai_hint: 'cinematic still',
    link: 'https://sub2get.com/link?l=9545' 
  },
];

export default function FreebiesPage() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>Free Resources</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Enjoy a selection of free tools to get a taste of the quality and style of my products.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {freebies.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BackgroundGradient animate={true} containerClassName="h-full rounded-2xl" className="rounded-2xl h-full bg-card text-card-foreground p-6 flex flex-col">
              <div className="overflow-hidden rounded-md mb-4 aspect-[16/9]">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover"
                  data-ai-hint={item.data_ai_hint}
                />
              </div>
              <h3 className="font-headline text-2xl text-foreground">{item.name}</h3>
              <p className="text-foreground/70 mt-2 flex-grow">{item.description}</p>
              <Link href={item.link} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider mt-6">
                <span>Download</span>
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </Link>
            </BackgroundGradient>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
