
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const gear = [
  { 
    id: 1, 
    name: 'Sony A7S III', 
    category: 'Camera',
    description: 'My primary workhorse for both video and photography. Incredible low-light performance and amazing video quality.',
    image: 'https://placehold.co/1600x900.png', 
    data_ai_hint: 'sony camera',
    link: '#' 
  },
  { 
    id: 2, 
    name: 'Sigma 24-70mm f/2.8', 
    category: 'Lens',
    description: 'The most versatile lens in my bag. Perfect for almost any situation, from wide shots to portraits.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'camera lens', 
    link: '#'
  },
  { 
    id: 3, 
    name: 'DJI Ronin-S', 
    category: 'Stabilizer',
    description: 'For those buttery smooth cinematic shots. It\'s reliable and easy to balance.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'camera stabilizer', 
    link: '#'
  },
  { 
    id: 4, 
    name: 'Aputure 120D II', 
    category: 'Lighting',
    description: 'A powerful and versatile key light that has been essential for my studio and interview setups.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'studio light', 
    link: '#'
  },
  { 
    id: 5, 
    name: 'Rode NTG4+', 
    category: 'Audio',
    description: 'Crisp, clean audio is non-negotiable. This shotgun mic delivers broadcast-quality sound.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'shotgun microphone', 
    link: '#'
  },
  { 
    id: 6, 
    name: 'Apple MacBook Pro M1 Max', 
    category: 'Editing',
    description: 'The machine that powers it all. Handles 4K editing and color grading without breaking a sweat.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'laptop computer', 
    link: '#'
  },
];

export default function GearPage() {
  return (
    <motion.div 
      className="container mx-auto py-16 md:py-24 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionTitle>My Gear</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        The tools I use and trust to create my content. This is a curated list of the gear that helps me bring my vision to life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gear.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-card text-card-foreground p-6 flex flex-col h-full rounded-2xl border-border/50">
              <div className="overflow-hidden rounded-md mb-4 aspect-[16/9] relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="w-full h-full object-cover"
                  data-ai-hint={item.data_ai_hint}
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-headline text-2xl text-foreground">{item.name}</h3>
                <p className="text-foreground/70 mt-2">{item.description}</p>
              </div>
              <Link href={item.link} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 font-headline text-accent uppercase tracking-wider mt-6">
                <span>View Product</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

    