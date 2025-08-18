
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Wand2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionTitle } from '@/components/ui/SectionTitle';

// Helper function to generate a plausible random curve
const generateRandomCurve = (): string => {
  const points = 12;
  const values = Array(points).fill(0).map(() => Math.random());
  
  // Basic smoothing
  const smoothed = values.map((val, i, arr) => {
    if (i > 0 && i < arr.length - 1) {
      return (arr[i-1] + val + arr[i+1]) / 3;
    }
    return val;
  });

  // Ensure start and end points are reasonable
  smoothed[0] = Math.min(0.2, smoothed[0]);
  smoothed[points - 1] = Math.max(0.8, smoothed[points - 1]);
  
  return smoothed.map(v => v.toFixed(3)).join(' ');
};

const CurveDisplay = ({ values, color, label }: { values: string, color: string, label: string }) => {
    const points = values.split(' ').map(Number);
    const pathD = points.map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 100 - (p * 100);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <div className="flex items-center gap-4">
             <div className="w-16 font-bold text-lg" style={{ color }}>{label}</div>
             <div className="flex-grow h-24 bg-card rounded-md p-2">
                <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                    <path d={pathD} stroke={color} strokeWidth="2" fill="none" />
                </svg>
             </div>
        </div>
    )
}

export default function TestPage() {
  const [curves, setCurves] = useState({ r: '0 0.25 0.5 0.75 1', g: '0 0.25 0.5 0.75 1', b: '0 0.25 0.5 0.75 1' });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client, avoiding hydration mismatches with Math.random()
    setIsClient(true);
    handleRandomize(); // Initial randomization on mount
  }, []);

  const handleRandomize = () => {
    setCurves({
      r: generateRandomCurve(),
      g: generateRandomCurve(),
      b: generateRandomCurve(),
    });
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
        <SectionTitle>RGB Curves Animation Test</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
            Click the button to generate random SVG color curves and see the effect on the image below. This is a proof-of-concept for the animation and rendering logic.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Controls Card */}
            <Card className="bg-card">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                        <h3 className="font-headline text-2xl mb-4">Live Preview</h3>
                        <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                            <svg className="absolute w-0 h-0">
                                <filter id="random-color-curve">
                                <feComponentTransfer>
                                    <feFuncR type="table" tableValues={curves.r} />
                                    <feFuncG type="table" tableValues={curves.g} />
                                    <feFuncB type="table" tableValues={curves.b} />
                                </feComponentTransfer>
                                </filter>
                            </svg>
                            <Image
                                src="https://placehold.co/1600x900.png"
                                alt="Filter Applied"
                                width={1600}
                                height={900}
                                className="w-full h-full object-cover"
                                style={{ filter: 'url(#random-color-curve)' }}
                                data-ai-hint="neutral portrait"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                        <Button onClick={handleRandomize} size="lg">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Randomize Curves
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="bg-card">
                <CardContent className="p-6">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="font-headline text-2xl mb-4">Generated Curves</h3>
                        <div className="space-y-4">
                            <CurveDisplay values={curves.r} color="hsl(var(--chart-1))" label="Red" />
                            <CurveDisplay values={curves.g} color="hsl(var(--chart-2))" label="Green" />
                            <CurveDisplay values={curves.b} color="hsl(var(--chart-3))" label="Blue" />
                        </div>
                        <div className="mt-6 space-y-2 text-xs font-mono text-muted-foreground bg-secondary p-3 rounded-md">
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-1))"}}>R:</span> {curves.r}</p>
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-2))"}}>G:</span> {curves.g}</p>
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-3))"}}>B:</span> {curves.b}</p>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
