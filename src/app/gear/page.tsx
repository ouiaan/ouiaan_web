
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
    name: 'Sony a6400', 
    category: 'Camera',
    description: 'Mi cámara principal para todo. Es compacta, potente y súper confiable para video y foto.',
    image: 'https://placehold.co/1600x900.png', 
    data_ai_hint: 'sony camera',
    link: '#' 
  },
  { 
    id: 2, 
    name: 'Viltrox 24mm f/1.4', 
    category: 'Lens',
    description: 'Este lente es increíble para tomas amplias y con poca luz, dándole un look muy cinemático.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'camera lens', 
    link: '#'
  },
  { 
    id: 3, 
    name: '7Artisans 50mm f/1.8', 
    category: 'Lens',
    description: 'Perfecto para retratos y tomas con un bonito desenfoque de fondo (bokeh).',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'camera lens portrait', 
    link: '#'
  },
  { 
    id: 4, 
    name: 'MacBook Air & Mac Mini M1', 
    category: 'Editing',
    description: 'La combinación que uso para editar. Potencia y portabilidad para manejar cualquier proyecto.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'apple computer', 
    link: '#'
  },
  { 
    id: 5, 
    name: 'DJI Mic 2 & Mini', 
    category: 'Audio',
    description: 'Audio inalámbrico de alta calidad, súper fácil de usar y esencial para un sonido profesional.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'wireless microphone', 
    link: '#'
  },
  { 
    id: 6, 
    name: 'Neewer SL60W & Softbox', 
    category: 'Lighting',
    description: 'Mi luz principal en el estudio. La softbox de 45cm crea una luz suave y difusa perfecta.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'studio light softbox', 
    link: '#'
  },
  { 
    id: 7, 
    name: 'Godox TT600 & X3', 
    category: 'Flash',
    description: 'Mi set de flash para fotografía. El TT600 es un caballo de batalla y el trigger X3 es súper moderno.',
    image: 'https://placehold.co/1600x900.png',
    data_ai_hint: 'camera flash', 
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
        Las herramientas que uso y en las que confío para crear mi contenido. Esta es una lista curada del equipo que me ayuda a darle vida a mi visión.
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
              <div className="font-headline text-accent uppercase tracking-wider mt-6">
                <span>{item.category}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
