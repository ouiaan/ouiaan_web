
'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Palette, Wand2, Loader2, AlertCircle, Copy, Pipette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGeneratePalette } from './actions';
import type { GenerateColorPaletteOutput } from '@/ai/flows/generate-color-palette';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

const ColorPicker = ({ label, value, onChange, disabled }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }) => (
    <div className="flex items-center gap-4">
      <Label htmlFor={`${label}-color`} className="font-headline text-lg text-foreground/80 w-28">{label}</Label>
      <Input
        id={`${label}-color`}
        type="color"
        value={value}
        onChange={onChange}
        className="w-16 h-10 p-1 bg-card border-border/50 cursor-pointer disabled:cursor-not-allowed"
        disabled={disabled}
      />
    </div>
  );

export function ColorAIClient() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<GenerateColorPaletteOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [shadows, setShadows] = useState('#2A342D');
  const [midtones, setMidtones] = useState('#8A8375');
  const [highlights, setHighlights] = useState('#F5E4C1');

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
              {/* Uploader */}
              <div 
                className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg h-80 cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
                {imagePreview ? (
                  <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-lg" />
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

            {/* Actions & Results */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-headline text-2xl mb-4">Guide the AI</h3>
                <p className="text-muted-foreground mb-6">Select the dominant tints from your image to get a more accurate analysis.</p>
              </div>

              <div className="space-y-4">
                <ColorPicker label="Shadows" value={shadows} onChange={(e) => setShadows(e.target.value)} disabled={!file} />
                <ColorPicker label="Midtones" value={midtones} onChange={(e) => setMidtones(e.target.value)} disabled={!file} />
                <ColorPicker label="Highlights" value={highlights} onChange={(e) => setHighlights(e.target.value)} disabled={!file} />
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
                    <TonalAnalysisCard title="Shadows" analysis={results.tonalAnalysis.shadows} />
                    <TonalAnalysisCard title="Midtones" analysis={results.tonalAnalysis.midtones} />
                    <TonalAnalysisCard title="Highlights" analysis={results.tonalAnalysis.highlights} />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
