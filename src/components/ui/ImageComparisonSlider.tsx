
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageComparisonSliderProps {
  before: string;
  after: string;
  alt: string;
  data_ai_hint?: string;
  className?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  before,
  after,
  alt,
  data_ai_hint,
  className,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
  };

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if(isDragging) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full aspect-video overflow-hidden rounded-xl group select-none", className)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Image
        src={before}
        alt={`Before - ${alt}`}
        fill
        priority
        className="object-cover pointer-events-none"
        data-ai-hint={data_ai_hint}
      />
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={after}
          alt={`After - ${alt}`}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/80 backdrop-blur-sm text-black p-1 rounded-full shadow-md">
          <ChevronLeft size={16} />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/80 backdrop-blur-sm text-black p-1 rounded-full shadow-md">
          <ChevronRight size={16} />
        </div>
      </div>
      
      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded">
        BEFORE
      </div>
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded"
        style={{ opacity: sliderPosition > 60 ? 1 : 0, transition: 'opacity 0.2s' }}
      >
        AFTER
      </div>
    </div>
  );
};
