
'use client';

import React, { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Wand2, Loader2, AlertCircle, FileImage, SlidersHorizontal, Palette, Thermometer, Contrast } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGenerateGrade } from './actions';
import type { GenerateColorGradeRecipeOutput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { cn } from '@/lib/utils';
import { ColorCurves } from './ColorCurves';

type HSLAdjustment = GenerateColorGradeRecipeOutput['hslAdjustments'][0];
type TonalPalette = GenerateColorGradeRecipeOutput['tonalPalette'];
type TonalPaletteKey = keyof TonalPalette;
type ToneCurve = GenerateColorGradeRecipeOutput['toneCurve'];
type WhiteBalance = GenerateColorGradeRecipeOutput['whiteBalance'];


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
                 <p className="text-sm text-foreground/80 mt-4">{analysis.description}</p>
            </div>
        </BackgroundGradient>
    );
}

const HSLAnalysisCard = ({ adjustments }: { adjustments: HSLAdjustment[] }) => {
  return (
    <BackgroundGradient animate={true} containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground p-6">
        <h3 className="font-headline text-2xl mb-4 flex items-center gap-2"><SlidersHorizontal /> HSL Analysis</h3>
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
                        <span className="font-semibold text-sm">{adj.colorName}</span>
                    </div>
                    <div className="font-mono text-accent text-sm text-center">{adj.hue}</div>
                    <div className="font-mono text-accent text-sm text-center">{adj.saturation}</div>
                    <div className="font-mono text-accent text-sm text-center col-span-2 md:col-span-1">{adj.luminance}</div>
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
      <h3 className="font-headline text-2xl mb-4 text-center">General Analysis</h3>
      <div className="space-y-6">
        {/* White Balance */}
        <div className="flex items-start gap-4">
          <Thermometer className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground">Temperature</h4>
            <p className="text-foreground/80 text-sm">{analysis.temperature}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Palette className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground">Tint</h4>
            <p className="text-foreground/80 text-sm">{analysis.tint}</p>
          </div>
        </div>
        
        {/* Tone Curve */}
        <div className="flex items-start gap-4">
          <Contrast className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground">Tone Curve</h4>
            <ul className="text-foreground/80 text-sm list-disc pl-5 mt-1 space-y-1">
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


const ImageUploader = ({ title, imagePreview, onFileChange, icon: Icon }: { title: string, imagePreview: string | null, onFileChange: (e: ChangeEvent<HTMLInputElement>) => void, icon: React.ElementType }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <h3 className="font-headline text-2xl flex items-center gap-2 text-foreground/80"><Icon className="h-6 w-6"/> {title}</h3>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-border rounded-lg h-[250px] w-full cursor-pointer hover:bg-secondary transition-colors"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                 <AnimatePresence>
                  {imagePreview ? (
                     <motion.div
                       key="image"
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.8 }}
                       className="absolute inset-0 p-2"
                     >
                       <Image
                         src={imagePreview}
                         alt={`${title} preview`}
                         fill
                         style={{ objectFit: 'contain' }}
                         className="rounded-lg"
                       />
                     </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute flex flex-col items-center justify-center text-center text-muted-foreground"
                    >
                      <UploadCloud className="h-10 w-10 mb-2" />
                      <p>Click to upload</p>
                    </motion.div>
                  )}
                 </AnimatePresence>
            </div>
        </div>
    );
};


export function ColorAIClient() {
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const [results, setResults] = useState<GenerateColorGradeRecipeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const handleFileChange = (setter: (file: File | null) => void, previewSetter: (url: string | null) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setter(selectedFile);
      setResults(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
    if (!referenceImageFile) {
      toast({
        title: 'Missing Image',
        description: 'Please upload a reference image to analyze.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setError(null);
      setResults(null);
      try {
        const referenceBase64 = await fileToBase64(referenceImageFile);

        const response = await runGenerateGrade({
          referencePhotoDataUri: referenceBase64,
        });

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

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="bg-card border-dashed border-2">
        <CardContent className="p-6">
          <div className="max-w-md mx-auto">
            <ImageUploader
                title="Reference Image"
                imagePreview={referenceImagePreview}
                onFileChange={handleFileChange(setReferenceImageFile, setReferenceImagePreview)}
                icon={FileImage}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={handleGenerate} disabled={isPending || !referenceImageFile} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full max-w-xs">
                {isPending ? (
                <span className="flex items-center justify-center font-bold text-lg">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                </span>
                ) : (
                <span className="flex items-center justify-center font-bold text-lg">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Analyze Grade
                </span>
                )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isPending && (
          <motion.div key="loader" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-10">
            <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto" />
            <p className="mt-4 text-muted-foreground text-lg font-semibold">Analyzing, please wait...</p>
          </motion.div>
        )}

        {error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg flex items-center gap-4">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </motion.div>
        )}

        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex flex-col gap-12">

            <div className="w-full flex flex-col items-center">
                <h3 className="font-headline text-3xl mb-6">Your Color Grade Recipe</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-8">
                
                <div className="w-full flex flex-col">
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
                </div>

                <div className="w-full">
                    <h3 className="font-headline text-2xl mb-4">Tonal Analysis</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <TonalAnalysisCard title="shadows" analysis={results.tonalPalette.shadows} />
                        <TonalAnalysisCard title="midtones" analysis={results.tonalPalette.midtones} />
                        <TonalAnalysisCard title="highlights" analysis={results.tonalPalette.highlights} />
                    </div>
                </div>

                {results.hslAdjustments && (
                  <div className="w-full">
                    <HSLAnalysisCard adjustments={results.hslAdjustments} />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8 sticky top-24">
                  {results.whiteBalance && results.toneCurve && (
                     <div className="w-full">
                        <GeneralAnalysisCard analysis={results.whiteBalance} toneCurve={results.toneCurve} />
                     </div>
                  )}

                  {results.tonalPalette && (
                    <div className="w-full">
                        <h3 className="font-headline text-2xl mb-4 text-center">Tone Curve Analysis</h3>
                        <ColorCurves tonalPalette={results.tonalPalette} />
                    </div>
                  )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

