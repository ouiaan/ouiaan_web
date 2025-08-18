
'use client';

import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { runGenerateRgbCurves } from './actions';
import type { GenerateRgbCurvesOutput } from '@/ai/flows/generate-rgb-curves';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function TestPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<GenerateRgbCurvesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        const response = await runGenerateRgbCurves({ photoDataUri: base64Image });
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

  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
        <SectionTitle>RGB Curves AI Test</SectionTitle>
        <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
            Experimental page to generate SVG color curves from an image.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Uploader Card */}
            <Card className="bg-card">
                <CardContent className="p-6">
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
                            Click to browse or drag & drop an image
                        </p>
                        </>
                    )}
                    </div>
                    <div className="mt-6 flex flex-col items-center">
                        <Button onClick={handleGenerate} disabled={isPending || !file} size="lg">
                        {isPending ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Curves...
                            </>
                        ) : (
                            <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Curves
                            </>
                        )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="bg-card">
                <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                        {isPending && (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full">
                                <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto" />
                                <p className="mt-4 text-muted-foreground">AI is inspecting the light spectrum...</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full">
                                <div className="bg-destructive/20 border border-destructive text-destructive-foreground p-4 rounded-lg flex items-center gap-4">
                                <AlertCircle className="h-6 w-6" />
                                <p>{error}</p>
                                </div>
                            </motion.div>
                        )}
                        
                        {!isPending && !error && !results && (
                             <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-muted-foreground">The generated SVG filter will be applied here.</p>
                             </motion.div>
                        )}

                        {results && (
                        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h3 className="font-headline text-2xl mb-4">Generated Filter Preview</h3>
                            <p className="text-sm text-muted-foreground mb-4">{results.description}</p>
                            
                            <svg className="absolute w-0 h-0">
                                <filter id="ai-color-curve">
                                <feComponentTransfer>
                                    <feFuncR type="table" tableValues={results.r} />
                                    <feFuncG type="table" tableValues={results.g} />
                                    <feFuncB type="table" tableValues={results.b} />
                                </feComponentTransfer>
                                </filter>
                            </svg>

                            <div className="aspect-video w-full rounded-lg overflow-hidden">
                                <Image
                                    src="https://placehold.co/1600x900.png"
                                    alt="AI Filter Applied"
                                    width={1600}
                                    height={900}
                                    className="w-full h-full object-cover"
                                    style={{ filter: 'url(#ai-color-curve)' }}
                                    data-ai-hint="neutral portrait"
                                />
                            </div>
                            <div className="mt-4 space-y-2 text-xs font-mono text-muted-foreground">
                                <p><span className="font-bold text-red-400">R:</span> {results.r}</p>
                                <p><span className="font-bold text-green-400">G:</span> {results.g}</p>
                                <p><span className="font-bold text-blue-400">B:</span> {results.b}</p>
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

