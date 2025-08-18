
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
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    return (
        <div className="flex items-center gap-4">
             <div className="w-16 font-bold text-lg" style={{ color }}>{label}</div>
             <div className="flex-grow h-24 bg-card rounded-md p-2 relative">
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
  
  const generateCurvePath = (values: string) => {
    const points = values.split(' ').map(Number);
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 100 - (p * 100);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };


  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
        <SectionTitle>RGB Curves Simulator</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
            This is a visual prototype of the RGB curves generator. Click the button to see how different random curves are rendered.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Curves Graph Card */}
            <Card className="bg-card">
                <CardContent className="p-6">
                    <h3 className="font-headline text-2xl mb-4 text-center">Tone Curve</h3>
                    <div className="aspect-square w-full rounded-lg bg-secondary p-4 relative">
                        {/* Grid */}
                        <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 w-[calc(100%-2rem)] h-[calc(100%-2rem)]">
                            <div className="border-r border-b border-foreground/10"></div>
                            <div className="border-b border-foreground/10"></div>
                            <div className="border-r border-foreground/10"></div>
                            <div></div>
                        </div>

                        {/* Diagonal Line */}
                        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="100" y2="0" stroke="hsl(var(--foreground))" strokeOpacity="0.3" strokeWidth="0.5" />
                        </svg>

                        {/* RGB Curves */}
                        <motion.svg 
                            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]" 
                            viewBox="0 0 100 100" 
                            preserveAspectRatio="none"
                            key={JSON.stringify(curves)}
                         >
                            <motion.path 
                                d={generateCurvePath(curves.r)} 
                                stroke="hsl(var(--chart-1))" 
                                strokeWidth="1" 
                                fill="none"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                            <motion.path 
                                d={generateCurvePath(curves.g)} 
                                stroke="hsl(var(--chart-2))" 
                                strokeWidth="1" 
                                fill="none" 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                            />
                            <motion.path 
                                d={generateCurvePath(curves.b)} 
                                stroke="hsl(var(--chart-3))" 
                                strokeWidth="1" 
                                fill="none" 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                             />
                        </motion.svg>
                    </div>
                </CardContent>
            </Card>

            {/* Controls & Data Card */}
            <Card className="bg-card">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                     <div>
                        <h3 className="font-headline text-2xl mb-4">Generated Values</h3>
                        <div className="space-y-2 text-xs font-mono text-muted-foreground bg-secondary p-3 rounded-md overflow-x-auto">
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-1))"}}>R:</span> {curves.r}</p>
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-2))"}}>G:</span> {curves.g}</p>
                            <p><span className="font-bold" style={{color: "hsl(var(--chart-3))"}}>B:</span> {curves.b}</p>
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
        </div>
    </div>
  );
}
