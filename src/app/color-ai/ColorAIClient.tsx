
'use client';

import { useState, useTransition, ChangeEvent, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, Palette, Wand2, Loader2, AlertCircle, Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGeneratePalette } from './actions';
import type { GenerateColorPaletteOutput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


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
                    className="w-full h-16 rounded-md cursor-pointer border border-border mt-4"
                    style={{ backgroundColor: analysis.color }}
                    onClick={() => copyToClipboard(analysis.color)}
                />
                 <p className="font-mono text-sm mt-2 text-muted-foreground">{analysis.color}</p>
                 <p className="text-sm text-foreground/80 mt-2">{analysis.description}</p>
            </div>
        </BackgroundGradient>
    );
}

const ColorPicker = ({ label, value, onColorChange, onEyeDropperClick, disabled, isPicking }: { 
    label: string, 
    value: string, 
    onColorChange: (e: ChangeEvent<HTMLInputElement>) => void, 
    onEyeDropperClick: () => void,
    disabled?: boolean,
    isPicking?: boolean
}) => (
    <div className="flex items-center gap-4">
      <Label htmlFor={`${label}-color`} className="font-headline text-lg text-foreground/80 w-28">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={`${label}-color`}
          type="color"
          value={value}
          onChange={onColorChange}
          className="w-16 h-10 p-1 bg-card border-border/50 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />
        <Button 
            variant="outline" 
            size="icon"
            onClick={onEyeDropperClick}
            disabled={disabled}
            className={cn(isPicking && "ring-2 ring-accent")}
        >
            <Pipette className="h-5 w-5"/>
        </Button>
      </div>
    </div>
  );

export function ColorAIClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<GenerateColorPaletteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [shadows, setShadows] = useState('#2A342D');
  const [midtones, setMidtones] = useState('#8A8375');
  const [highlights, setHighlights] = useState('#F5E4C1');

  const [pickingColorFor, setPickingColorFor] = useState<string | null>(null);

  const drawImageToCanvas = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the container
    const container = canvas.parentElement;
    if (!container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const canvasAspectRatio = canvas.width / canvas.height;
    const imageAspectRatio = image.naturalWidth / image.naturalHeight;

    let renderWidth, renderHeight, x, y;

    if (canvasAspectRatio > imageAspectRatio) {
      renderHeight = canvas.height;
      renderWidth = image.naturalWidth * (renderHeight / image.naturalHeight);
      x = (canvas.width - renderWidth) / 2;
      y = 0;
    } else {
      renderWidth = canvas.width;
      renderHeight = image.naturalHeight * (renderWidth / image.naturalWidth);
      x = 0;
      y = (canvas.height - renderHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, x, y, renderWidth, renderHeight);
  };


  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        drawImageToCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!pickingColorFor || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    // If alpha is 0, it's a transparent pixel, so do nothing.
    if (pixelData[3] === 0) return;

    const hex = `#${("000000" + ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6)}`;
    
    if (pickingColorFor === 'shadows') setShadows(hex);
    else if (pickingColorFor === 'midtones') setMidtones(hex);
    else if (pickingColorFor === 'highlights') setHighlights(hex);
    
    setPickingColorFor(null);
  };


  const startPicking = (target: string) => {
    if (!imagePreview) {
        toast({ title: "Upload an image first!", variant: "destructive" });
        return;
    }
    setPickingColorFor(current => current === target ? null : target);
    toast({ title: "Color Picker Activated", description: "Click on the image to pick a color."});
  }

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
          userShadows: shadows,
          userMidtones: midtones,
          userHighlights: highlights
        });
        if ('error' in response) {
          setError(response.error);
        } else {
          setResults(response);
        }
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
      };
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
    <div className="max-w-4xl mx-auto">
      <Card className="bg-card border-dashed border-2">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div 
                className={cn(
                    "relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg h-80",
                    !imagePreview && "cursor-pointer hover:bg-secondary transition-colors"
                )}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                {imagePreview ? (
                   <div className={cn("relative w-full h-full", pickingColorFor ? "cursor-crosshair" : "cursor-default")}>
                        <Image 
                            ref={imageRef}
                            src={imagePreview} 
                            alt="Image preview" 
                            fill
                            style={{ objectFit: 'contain' }}
                            className={cn("rounded-lg", pickingColorFor && "opacity-0")}
                            onLoad={drawImageToCanvas}
                        />
                         <canvas 
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            onClick={handleCanvasClick}
                            style={{ display: pickingColorFor ? 'block' : 'none' }}
                        />
                   </div>
                ) : (
                  <>
                    <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Click or drag & drop to upload
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-headline text-2xl mb-4">Guide the AI</h3>
                <p className="text-muted-foreground mb-6">Use the eyedropper or color wheel to select tints from your image.</p>
              </div>

              <div className="space-y-4">
                <ColorPicker label="Shadows" value={shadows} onColorChange={(e) => setShadows(e.target.value)} onEyeDropperClick={() => startPicking('shadows')} disabled={!file} isPicking={pickingColorFor === 'shadows'} />
                <ColorPicker label="Midtones" value={midtones} onColorChange={(e) => setMidtones(e.target.value)} onEyeDropperClick={() => startPicking('midtones')} disabled={!file} isPicking={pickingColorFor === 'midtones'} />
                <ColorPicker label="Highlights" value={highlights} onColorChange={(e) => setHighlights(e.target.value)} onEyeDropperClick={() => startPicking('highlights')} disabled={!file} isPicking={pickingColorFor === 'highlights'}/>
              </div>
              
              <Button onClick={handleGenerate} disabled={isPending || !file} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze
                  </>
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
            <p className="mt-4 text-muted-foreground">Analyzing your image...</p>
          </motion.div>
        )}

        {error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg flex items-center gap-4">
            <AlertCircle className="h-6 w-6" />
            <p>{error}</p>
          </motion.div>
        )}

        {results && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
            <div>
                <h4 className="font-headline text-2xl mb-4 flex items-center justify-center gap-2"><Palette/> Generated Palette</h4>
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
            
            <div className="mt-12">
                <h4 className="font-headline text-2xl mb-8 flex items-center justify-center gap-2"><Pipette /> Tonal Analysis</h4>
                <div className="grid md:grid-cols-3 gap-6">
                    {results.tonalAnalysis.shadows && <TonalAnalysisCard title="Shadows" analysis={results.tonalAnalysis.shadows} />}
                    {results.tonalAnalysis.midtones && <TonalAnalysisCard title="Midtones" analysis={results.tonalAnalysis.midtones} />}
                    {results.tonalAnalysis.highlights && <TonalAnalysisCard title="Highlights" analysis={results.tonalAnalysis.highlights} />}
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

    