
'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Wand2, Loader2, AlertCircle, FileImage, Replace } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGenerateGrade } from './actions';
import type { GenerateColorGradeRecipeOutput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { cn } from '@/lib/utils';


type HSLAdjustment = GenerateColorGradeRecipeOutput['hslAdjustments'][0];
type TonalPaletteAnalysis = GenerateColorGradeRecipeOutput['tonalPalette'];

const TonalAnalysisCard = ({ title, analysis }: { title: keyof TonalPaletteAnalysis, analysis: TonalPaletteAnalysis[keyof TonalPaletteAnalysis] }) => {
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

const HSLAdjustmentCard = ({ adjustment }: { adjustment: HSLAdjustment }) => {
    return (
        <BackgroundGradient animate={true} containerClassName="rounded-2xl h-full" className="rounded-2xl h-full bg-card text-card-foreground p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-md border border-border" style={{ backgroundColor: adjustment.hex }} />
                <h4 className="font-headline text-xl text-foreground">{adjustment.colorName}</h4>
            </div>
            <div className="space-y-3 text-sm flex-grow">
                <div className="flex justify-between items-center">
                    <span className="text-foreground/80">Hue Shift:</span>
                    <span className="font-mono text-accent">{adjustment.hueShift}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-foreground/80">Saturation:</span>
                    <span className="font-mono text-accent">{adjustment.saturation}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-foreground/80">Luminance:</span>
                    <span className="font-mono text-accent">{adjustment.luminance}</span>
                </div>
            </div>
            <p className="text-xs text-foreground/60 mt-4 pt-4 border-t border-border/50">{adjustment.reasoning}</p>
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
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [sourceImagePreview, setSourceImagePreview] = useState<string | null>(null);
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
    if (!sourceImageFile || !referenceImageFile) {
      toast({
        title: 'Missing Images',
        description: 'Please upload both a source and a reference image.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setError(null);
      setResults(null);
      try {
        const [sourceBase64, referenceBase64] = await Promise.all([
            fileToBase64(sourceImageFile),
            fileToBase64(referenceImageFile)
        ]);
        
        const response = await runGenerateGrade({ 
          sourcePhotoDataUri: sourceBase64,
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
    <div className="max-w-6xl mx-auto">
      <Card className="bg-card border-dashed border-2">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ImageUploader 
                title="Source Image" 
                imagePreview={sourceImagePreview}
                onFileChange={handleFileChange(setSourceImageFile, setSourceImagePreview)}
                icon={FileImage}
            />
            <ImageUploader 
                title="Reference Image" 
                imagePreview={referenceImagePreview}
                onFileChange={handleFileChange(setReferenceImageFile, setReferenceImagePreview)}
                icon={Replace}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Button onClick={handleGenerate} disabled={isPending || !sourceImageFile || !referenceImageFile} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full max-w-xs">
                {isPending ? (
                <span className="flex items-center font-bold text-lg">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                </span>
                ) : (
                <span className="flex items-center font-bold text-lg">
                    <Wand2 className="mr-2 h-5 w-5" />
                    Get Your Grade!
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
            <p className="mt-4 text-muted-foreground text-lg font-semibold">Almost there Picasso!</p>
          </motion.div>
        )}

        {error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg flex items-center gap-4">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </motion.div>
        )}

        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex flex-col items-center gap-12">
            
            <div className="w-full flex flex-col items-center">
              <h3 className="font-headline text-2xl mb-4">Generated Palette</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {results.colorPalette.map((color) => (
                  <motion.div
                    key={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-20 h-20 rounded-md cursor-pointer relative group"
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

            <div className="w-full flex flex-col items-center">
                <h3 className="font-headline text-2xl mb-4">Tonal Analysis</h3>
                <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <TonalAnalysisCard title="shadows" analysis={results.tonalPalette.shadows} />
                    <TonalAnalysisCard title="midtones" analysis={results.tonalPalette.midtones} />
                    <TonalAnalysisCard title="highlights" analysis={results.tonalPalette.highlights} />
                </div>
            </div>
            
            {results.hslAdjustments && (
              <div className="w-full flex flex-col items-center">
                <h3 className="font-headline text-2xl mb-4">HSL Primary Color Analysis</h3>
                <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
                  {results.hslAdjustments.map((adj) => (
                    <HSLAdjustmentCard key={adj.colorName} adjustment={adj} />
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

    