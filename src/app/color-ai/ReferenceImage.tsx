
'use client';

import { useState, useRef, MouseEvent, useEffect, useCallback } from 'react';
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
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Create a canvas to get image data
    useEffect(() => {
        const image = new window.Image();
        image.src = src;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                canvasRef.current = canvas;
            }
        };
    }, [src]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!mode) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => {
        setMousePos(null);
    };

    const handleClick = useCallback(() => {
        if (!mode || !mousePos || !canvasRef.current || !imageRef.current) return;

        const imageEl = imageRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate the actual pixel coordinates on the original image
        const nativeX = Math.floor((mousePos.x / imageEl.clientWidth) * canvas.width);
        const nativeY = Math.floor((mousePos.y / imageEl.clientHeight) * canvas.height);

        const pixelData = ctx.getImageData(nativeX, nativeY, 1, 1).data;
        const hex = `#${("000000" + ((pixelData[0] << 16) | (pixelData[1] << 8) | pixelData[2]).toString(16)).slice(-6)}`;
        onColorSelect(hex);
    }, [mode, mousePos, onColorSelect]);

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
                }
            `}</style>
        </div>
    );
}
