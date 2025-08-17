'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image, { type ImageProps } from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageComparisonSliderProps {
  beforeImage: ImageProps;
  afterImage: ImageProps;
  className?: string;
}

export function ImageComparisonSlider({ beforeImage, afterImage, className }: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
        handleMove(moveEvent as unknown as React.MouseEvent<HTMLDivElement>);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const handleTouchMove = (moveEvent: TouchEvent) => {
        handleMove(moveEvent as unknown as React.TouchEvent<HTMLDivElement>);
    };
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full aspect-[16/9] overflow-hidden rounded-md cursor-ew-resize select-none", className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Image
        {...beforeImage}
        alt={beforeImage.alt || 'Before'}
        className="absolute inset-0 w-full h-full object-cover"
        width={1600}
        height={900}
      />
      <div
        className="absolute inset-0 w-full h-full object-cover overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          {...afterImage}
          alt={afterImage.alt || 'After'}
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={900}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 pointer-events-none"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-black">
          <ChevronLeft className="h-5 w-5" />
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>

       {/* Before/After Labels */}
       <div className="absolute top-2 left-2 bg-black/50 text-white text-xs uppercase px-2 py-1 rounded">Before</div>
       <div className="absolute top-2 right-2 bg-black/50 text-white text-xs uppercase px-2 py-1 rounded" style={{ opacity: sliderPosition > 60 ? 1 : 0, transition: 'opacity 0.2s' }}>After</div>
    </div>
  );
}
