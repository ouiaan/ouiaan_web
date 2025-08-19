
'use client';

import { useState, useTransition, ChangeEvent, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, Palette, Wand2, Loader2, AlertCircle, Pipette, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGeneratePalette } from './actions';
import type { GenerateColorPaletteOutput, GenerateColorPaletteInput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


type TonalPaletteInput = NonNullable<GenerateColorPaletteInput['tonalPalette']>;
type HSLAdjustment = GenerateColorPaletteOutput['hslAdjustments'][0];

const TonalAnalysisCard = ({ title, analysis }: { title: string, analysis: { description: string, color: string } }) => {
    const { toast } = useToast();

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
                <h4 className="font-headline text-xl text-foreground flex items-center gap-2">{title}</h4>
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


const ColorPicker = ({ label, color, onColorPick }: { label: string, color: string, onColorPick: () => void }) => {
    const { toast } = useToast();
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
          title: 'Copied to Clipboard!',
          description: `Color ${text} copied.`,
        });
    }

    return (
        <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-4">
                <div 
                    className="w-12 h-12 rounded-md border border-border cursor-pointer shrink-0" 
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                />
                <div>
                    <Label className="font-headline text-lg text-foreground/80">{label}</Label>
                    <p className="font-mono text-muted-foreground">{color}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onColorPick} aria-label={`Pick ${label} color`}>
                <Pipette className="h-6 w-6" />
            </Button>
        </div>
    );
};


export function ColorAIClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<GenerateColorPaletteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isPicking, setIsPicking] = useState<keyof TonalPaletteInput | null>(null);
  
  const [tonalPalette, setTonalPalette] = useState<TonalPaletteInput>({
      shadows: { color: '#2C3E50' },
      midtones: { color: '#808080' },
      highlights: { color: '#ECF0F1' },
  });


  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerate = () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload an image first.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      setError(null);
      setResults(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const response = await runGeneratePalette({ 
          photoDataUri: base64Image,
          tonalPalette: {
            shadows: { color: tonalPalette.shadows.color },
            midtones: { color: tonalPalette.midtones.color },
            highlights: { color: tonalPalette.highlights.color },
          }
        });
        if ('error' in response) {
          setError(response.error);
        } else {
          setResults(response);
          // Set the tonal palette from the AI response, but only if the user didn't provide one
          if (!response.error) {
              setTonalPalette({
                  shadows: { color: response.tonalPalette.shadows.color },
                  midtones: { color: response.tonalPalette.midtones.color },
                  highlights: { color: response.tonalPalette.highlights.color },
              });
          }
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
    });
  };

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPicking || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
    
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate click position relative to the image element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate ratio of click position to image element's dimensions
    const xRatio = x / rect.width;
    const yRatio = y / rect.height;

    // Apply ratio to the original image dimensions to get the correct pixel
    const pixelX = Math.floor(xRatio * image.naturalWidth);
    const pixelY = Math.floor(yRatio * image.naturalHeight);

    const [r, g, b] = ctx.getImageData(pixelX, pixelY, 1, 1).data;
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

    setTonalPalette(prev => {
        if (!isPicking) return prev;
        const newPalette = { ...prev };
        newPalette[isPicking] = { color: hexColor };
        return newPalette;
    });

    setIsPicking(null);
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
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div 
                className={cn(
                    "relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg h-[400px]",
                    {"cursor-crosshair": isPicking},
                    {"cursor-pointer hover:bg-secondary transition-colors": !isPicking && !imagePreview}
                )}
                onClick={!isPicking ? () => fileInputRef.current?.click() : undefined}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
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
                       onClick={handleImageClick}
                     >
                       <Image
                         ref={imageRef}
                         src={imagePreview}
                         alt="Image preview"
                         fill
                         style={{ objectFit: 'contain' }}
                         className="rounded-lg"
                         crossOrigin='anonymous'
                       />
                     </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute flex flex-col items-center justify-center text-center"
                    >
                      <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Click or drag & drop to upload
                      </p>
                    </motion.div>
                  )}
                 </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col h-full justify-center items-center space-y-6">
                <div className="text-center">
                    <h3 className="font-headline text-2xl mb-2">Tonal Selection</h3>
                    <p className="text-muted-foreground mb-6">Use the eyedropper to select the tones from your image, or let the AI suggest them for you.</p>
                </div>

                <div className="space-y-4 w-full max-w-xs">
                    <ColorPicker label="Shadows" color={tonalPalette.shadows.color} onColorPick={() => setIsPicking('shadows')} />
                    <ColorPicker label="Midtones" color={tonalPalette.midtones.color} onColorPick={() => setIsPicking('midtones')} />
                    <ColorPicker label="Highlights" color={tonalPalette.highlights.color} onColorPick={() => setIsPicking('highlights')} />
                </div>
              
                <Button onClick={handleGenerate} disabled={isPending || !file} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full max-w-xs">
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
              <h4 className="font-headline text-2xl mb-4 flex items-center justify-center gap-2">
                <Palette /> Generated Palette
              </h4>
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
                <h4 className="font-headline text-2xl mb-4 flex items-center justify-center gap-2">
                    <Pipette /> Tonal Analysis
                </h4>
                <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {results.tonalPalette.shadows && <TonalAnalysisCard title="Shadows" analysis={results.tonalPalette.shadows} />}
                    {results.tonalPalette.midtones && <TonalAnalysisCard title="Midtones" analysis={results.tonalPalette.midtones} />}
                    {results.tonalPalette.highlights && <TonalAnalysisCard title="Highlights" analysis={results.tonalPalette.highlights} />}
                </div>
            </div>
            
            {results.hslAdjustments && (
              <div className="w-full flex flex-col items-center">
                <h4 className="font-headline text-2xl mb-4 flex items-center justify-center gap-2">
                  <SlidersHorizontal /> HSL Primary Color Analysis
                </h4>
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
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

    