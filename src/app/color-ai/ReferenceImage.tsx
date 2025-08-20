
'use client';

import { useState, useRef, MouseEvent, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type EyedropperMode = 'shadows' | 'midtones' | 'highlights' | null;

interface ReferenceImageProps {
    src: string;
    mode: EyedropperMode;
    onColorSelect: (color: string) => void;
}

const ZOOM_LEVEL = 4;
const LOUPE_SIZE = 120;

export function ReferenceImage({ src, mode, onColorSelect }: ReferenceImageProps) {
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!mode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => {
        setMousePos(null);
    };

    const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!mode || !imageRef.current) return;

        // Get the position of the click relative to the image element
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create a new canvas element in memory
        const canvas = document.createElement('canvas');
        const imageEl = imageRef.current;
        
        // Set canvas dimensions to the actual, intrinsic dimensions of the image
        canvas.width = imageEl.naturalWidth;
        canvas.height = imageEl.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw the image onto the canvas. This is the crucial step.
        // The image is already loaded in the DOM via the <Image> component.
        ctx.drawImage(imageEl, 0, 0, imageEl.naturalWidth, imageEl.naturalHeight);

        // Calculate the corresponding coordinates on the canvas
        const canvasX = Math.floor(x * (imageEl.naturalWidth / imageEl.clientWidth));
        const canvasY = Math.floor(y * (imageEl.naturalHeight / imageEl.clientHeight));
        
        // Get the pixel data from the canvas
        try {
            const pixelData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
            const r = pixelData[0];
            const g = pixelData[1];
            const b = pixelData[2];
            
            // Convert RGB to Hex
            const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
            const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            
            onColorSelect(hex);
        } catch (error) {
            console.error("Could not get image data:", error);
            // This might happen due to CORS if the image source wasn't local,
            // but for file uploads, it should be fine. We notify the user just in case.
            onColorSelect("#000000"); // Fallback to black
        }

    }, [mode, onColorSelect]);

    const showLoupe = mode && mousePos;

    return (
        <div 
            className={cn("relative aspect-video w-full rounded-xl overflow-hidden border-2", 
                mode ? 'cursor-none border-accent' : 'border-transparent',
                'transition-all duration-300'
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <Image
                ref={imageRef}
                src={src}
                alt="Reference for color grading"
                fill
                priority
                className="object-contain"
                // Crucially, remove crossOrigin for local file blobs to prevent canvas tainting
            />
            <AnimatePresence>
            {showLoupe && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="pointer-events-none absolute rounded-full border-4 border-white shadow-2xl overflow-hidden"
                    style={{
                        width: LOUPE_SIZE,
                        height: LOUPE_SIZE,
                        left: mousePos.x - LOUPE_SIZE / 2,
                        top: mousePos.y - LOUPE_SIZE / 2,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: `${imageRef.current!.clientWidth * ZOOM_LEVEL}px`,
                            height: `${imageRef.current!.clientHeight * ZOOM_LEVEL}px`,
                            left: -mousePos.x * ZOOM_LEVEL + LOUPE_SIZE / 2,
                            top: -mousePos.y * ZOOM_LEVEL + LOUPE_SIZE / 2,
                        }}
                    >
                         <Image src={src} alt="Zoomed reference" layout="fill" objectFit="contain" className="image-pixelated" />
                    </div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-full bg-white/50"></div>
                        <div className="w-full h-1 bg-white/50 absolute"></div>
                        <div className="w-2 h-2 rounded-full border-2 border-white bg-black/50"></div>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
            <style jsx global>{`
                .image-pixelated {
                    image-rendering: pixelated;
                    -ms-interpolation-mode: nearest-neighbor;
                }
            `}</style>
        </div>
    );
}
