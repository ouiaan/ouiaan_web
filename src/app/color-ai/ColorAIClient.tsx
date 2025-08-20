
'use client';

import React, { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Wand2, Loader2, AlertCircle, SlidersHorizontal, Palette, Thermometer, Contrast, UploadCloud, Pipette, Info, BarChart3, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGenerateGrade } from './actions';
import type { GenerateColorGradeRecipeOutput, GenerateColorGradeRecipeInput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { cn } from '@/lib/utils';
import { ReferenceImage, type EyedropperMode } from './ReferenceImage';
import { RgbCurveDisplay } from './RgbCurveDisplay';

type HSLAdjustment = GenerateColorGradeRecipeOutput['hslAdjustments'][0];
type TonalPalette = GenerateColorGradeRecipeOutput['tonalPalette'];
type TonalPaletteKey = keyof TonalPalette;
type ToneCurve = GenerateColorGradeRecipeOutput['toneCurve'];
type WhiteBalance = GenerateColorGradeRecipeOutput['whiteBalance'];
export type SelectedColors = {[key in EyedropperMode as string]: string | null};


const TonalAnalysisCard = ({ title, analysis }: { title: TonalPaletteKey, analysis: TonalPalette[TonalPaletteKey] }) => {
    const { toast } = useToast();

    if (!analysis) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: 'Copied to Clipboard!',
          description: `Color ${text} copied.`,
        });
      }

    return (
        <BackgroundGradient animate={true} containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 flex flex-col">
            <div className="flex-grow">
                <h4 className="font-headline text-xl text-foreground flex items-center gap-2 capitalize">{title}</h4>
                 <div
                    className="w-full h-24 rounded-md cursor-pointer border border-border mt-4 relative group"
                    style={{ backgroundColor: analysis.color }}
                    onClick={() => copyToClipboard(analysis.color)}
                >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white text-sm font-mono">{analysis.color}</span>
                    </div>
                </div>
                 <p className="text-base text-foreground/80 mt-4">{analysis.description}</p>
            </div>
        </BackgroundGradient>
    );
}

const HSLAnalysisCard = ({ adjustments }: { adjustments: HSLAdjustment[] }) => {
  return (
    <BackgroundGradient animate={true} containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground p-6">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-4 gap-y-2">
            {/* Headers */}
            <div className="font-bold text-foreground/70 text-xs uppercase tracking-wider col-span-2">Color</div>
            <div className="font-bold text-foreground/70 text-xs uppercase tracking-wider text-center">H</div>
            <div className="font-bold text-foreground/70 text-xs uppercase tracking-wider text-center">S</div>
            <div className="font-bold text-foreground/70 text-xs uppercase tracking-wider text-center col-span-2 md:col-span-1">L</div>
            <div className="hidden md:block font-bold text-foreground/70 text-xs uppercase tracking-wider col-span-3"></div>
            
            <div className="col-span-8 border-b border-border/50 my-1"></div>

            {adjustments.map((adj) => (
                <React.Fragment key={adj.colorName}>
                    <div className="col-span-2 flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", `bg-${adj.colorName.toLowerCase()}`)}></div>
                        <span className="font-semibold text-base">{adj.colorName}</span>
                    </div>
                    <div className="font-mono text-accent text-base text-center">{adj.hue}</div>
                    <div className="font-mono text-accent text-base text-center">{adj.saturation}</div>
                    <div className="font-mono text-accent text-base text-center col-span-2 md:col-span-1">{adj.luminance}</div>
                    <div className="hidden md:block col-span-3"></div>
                </React.Fragment>
            ))}
        </div>
        {/* Temp style for colors. In a real app this would be in tailwind config */}
        <style jsx>{`
            .bg-reds { background-color: #ef4444; }
            .bg-oranges { background-color: #f97316; }
            .bg-yellows { background-color: #eab308; }
            .bg-greens { background-color: #22c55e; }
            .bg-aquas { background-color: #14b8a6; }
            .bg-blues { background-color: #3b82f6; }
            .bg-purples { background-color: #8b5cf6; }
            .bg-magentas { background-color: #d946ef; }
        `}</style>
    </BackgroundGradient>
  );
};

const GeneralAnalysisCard = ({ analysis, toneCurve }: { analysis: WhiteBalance, toneCurve: ToneCurve }) => {
  return (
    <BackgroundGradient animate={true} containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground p-6">
      <div className="space-y-6">
        {/* White Balance */}
        <div className="flex items-start gap-4">
          <Thermometer className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-lg">Temperature</h4>
            <p className="text-foreground/80 text-base">{analysis.temperature}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Palette className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-lg">Tint</h4>
            <p className="text-foreground/80 text-base">{analysis.tint}</p>
          </div>
        </div>
        
        {/* Tone Curve */}
        <div className="flex items-start gap-4">
          <Contrast className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground text-lg">Tone Curve</h4>
            <ul className="text-foreground/80 text-base list-disc pl-5 mt-1 space-y-1">
                {toneCurve.map(point => (
                    <li key={point.point}>
                        <span className="font-semibold">{point.point}:</span> {point.adjustment}
                    </li>
                ))}
            </ul>
          </div>
        </div>

      </div>
    </BackgroundGradient>
  );
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

export function ColorAIClient() {
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  
  const [eyedropperMode, setEyedropperMode] = useState<EyedropperMode>(null);
  const [selectedColors, setSelectedColors] = useState<SelectedColors>({
    shadows: null,
    midtones: null,
    highlights: null,
  });

  const [results, setResults] = useState<GenerateColorGradeRecipeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setReferenceImageFile(selectedFile);
      setResults(null);
      setError(null);
      setEyedropperMode(null);
      setSelectedColors({ shadows: null, midtones: null, highlights: null });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleColorSelect = (color: string) => {
    if (eyedropperMode) {
      setSelectedColors(prev => ({...prev, [eyedropperMode]: color}));
      toast({
        title: `${eyedropperMode.charAt(0).toUpperCase() + eyedropperMode.slice(1)} Color Selected`,
        description: `Set to ${color}`,
      });
      setEyedropperMode(null); // Exit eyedropper mode after selection
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }

  const handleGenerate = () => {
    if (!referenceImageFile || !selectedColors.shadows || !selectedColors.midtones || !selectedColors.highlights) {
      toast({
        title: 'Missing Inputs',
        description: 'Please upload a reference image and select colors for shadows, midtones, and highlights.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setError(null);
      setResults(null);
      try {
        const referenceBase64 = await fileToBase64(referenceImageFile);

        const input: GenerateColorGradeRecipeInput = {
          referencePhotoDataUri: referenceBase64,
          userSelectedTones: {
            shadows: selectedColors.shadows!,
            midtones: selectedColors.midtones!,
            highlights: selectedColors.highlights!,
          }
        };

        const response = await runGenerateGrade(input);

        if (response && 'error' in response) {
          setError(response.error);
        } else if (response) {
          setResults(response);
        } else {
            setError("Received an unexpected null response from the server.");
        }
      } catch (e) {
          const message = e instanceof Error ? e.message : "An unknown error occurred during file processing.";
          setError(message);
          console.error(e);
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: `Color ${text} copied.`,
    });
  }
  
  const allColorsSelected = selectedColors.shadows && selectedColors.midtones && selectedColors.highlights;

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="bg-card border-dashed border-2">
        <CardContent className="p-6">
          
          {!referenceImagePreview && (
            <div
                className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg h-[250px] w-full cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                <div className="absolute flex flex-col items-center justify-center text-center text-muted-foreground">
                    <UploadCloud className="h-10 w-10 mb-2" />
                    <p>Click to upload Reference Image</p>
                </div>
            </div>
          )}

          {referenceImagePreview && (
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <ReferenceImage 
                src={referenceImagePreview} 
                mode={eyedropperMode} 
                onColorSelect={handleColorSelect} 
              />
              <div className="flex flex-col gap-4">
                <h3 className="font-headline text-2xl">Eyedropper Tool</h3>
                <p className="text-muted-foreground">Click a button, then click on the image to select the corresponding color tint.</p>
                <div className="space-y-3">
                  {(['shadows', 'midtones', 'highlights'] as const).map(mode => (
                    <div key={mode} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                      <Button 
                        variant={eyedropperMode === mode ? 'default' : 'outline'}
                        onClick={() => setEyedropperMode(mode)} 
                        className="w-full justify-start gap-2"
                      >
                        <Pipette className="w-5 h-5" />
                        Pick {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                      <div 
                        className="w-10 h-10 rounded-md border-2" 
                        style={{ backgroundColor: selectedColors[mode] || 'transparent' }}
                      ></div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button onClick={handleGenerate} disabled={isPending || !allColorsSelected} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full max-w-xs">
                      {isPending ? (
                      <span className="flex items-center justify-center font-bold text-lg">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Almost there Picasso!
                      </span>
                      ) : (
                      <span className="flex items-center justify-center font-bold text-lg">
                          <Wand2 className="mr-2 h-5 w-5" />
                          Get Your Grade!
                      </span>
                      )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {isPending && (
          <motion.div key="loader" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-10">
            <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto" />
            <p className="mt-4 text-muted-foreground text-lg font-semibold">Almost there Picasso!</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg flex items-center gap-4">
          <AlertCircle className="h-6 w-6" />
          <p>{error}</p>
        </motion.div>
      )}

      {results && (
        <motion.div 
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12"
        >
            <div className="flex flex-col gap-12 max-w-4xl mx-auto">
                <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                    <h3 className="font-headline text-3xl mb-6">Your Reverse-Engineered Grade</h3>
                </motion.div>
                
                <motion.div variants={itemVariants} className="w-full flex flex-col">
                  <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><Palette/> Generated Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    {results.colorPalette.map((color) => (
                      <motion.div
                        key={color}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 rounded-md cursor-pointer relative group border border-border"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                      >
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white text-xs font-mono">{color}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {results.whiteBalance && results.toneCurve && (
                  <motion.div variants={itemVariants} className="w-full">
                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><Info /> General Analysis</h3>
                    <GeneralAnalysisCard analysis={results.whiteBalance} toneCurve={results.toneCurve} />
                  </motion.div>
                )}
    
                <motion.div variants={itemVariants} className="w-full">
                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><Droplets /> Tonal Analysis</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <TonalAnalysisCard title="shadows" analysis={results.tonalPalette.shadows} />
                        <TonalAnalysisCard title="midtones" analysis={results.tonalPalette.midtones} />
                        <TonalAnalysisCard title="highlights" analysis={results.tonalPalette.highlights} />
                    </div>
                </motion.div>
    
                {results.hslAdjustments && (
                  <motion.div variants={itemVariants} className="w-full">
                    <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><SlidersHorizontal /> HSL Analysis</h3>
                    <HSLAnalysisCard adjustments={results.hslAdjustments} />
                  </motion.div>
                )}

                {allColorsSelected && (
                    <motion.div variants={itemVariants} className="w-full">
                        <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><BarChart3 /> RGB Curves</h3>
                        <RgbCurveDisplay colors={selectedColors} />
                    </motion.div>
                )}
            </div>
              
        </motion.div>
      )}

    </div>
  );
}
